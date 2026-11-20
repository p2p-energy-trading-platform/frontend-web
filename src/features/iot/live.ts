import { useQueryClient } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { create } from 'zustand';

import type { RealtimeState, TopicMessage } from '#/lib/realtime/client';
import { useRealtimeStore } from '#/lib/realtime/store';
import { useRealtimeTopic } from '#/lib/realtime/use-topic';
import type { EnergyRange, FlexibleAsset, House, MeterReading } from './api';

/** Today's totals are refetched at most this often while readings arrive. */
export const SUMMARY_REFRESH_MS = 60_000;

const assetType = z.enum(['bess', 'ev']);

const readingSchema = z.object({
  meterId: z.string(),
  measuredAt: z.string(),
  seq: z.number(),
  solarKw: z.number(),
  consumptionKw: z.number(),
  netKw: z.number(),
  storageAssets: z.array(
    z.object({
      assetId: z.string(),
      assetType,
      socPct: z.number(),
      powerKw: z.number(),
      capacityKwh: z.number(),
      pluggedIn: z.boolean().optional(),
    }),
  ),
});

const statusSchema = z.object({
  meterStatus: z.enum(['online', 'offline']),
  lastHeartbeatAt: z.string().optional(),
});

const streamStateSchema = z.object({ state: z.enum(['interrupted', 'live']) });

export type LiveStatus = z.infer<typeof statusSchema>;

export function houseTopic(houseId: string): string {
  return `iot.house.${houseId}`;
}

/** Keeps the newer of two readings: later measuredAt, then higher seq. */
export function applyLiveReading(
  current: MeterReading | null | undefined,
  incoming: MeterReading,
): MeterReading | null | undefined {
  if (!current) return incoming;
  const diff = Date.parse(incoming.measuredAt) - Date.parse(current.measuredAt);
  if (diff > 0 || (diff === 0 && incoming.seq > current.seq)) return incoming;
  return current;
}

export function applyLiveStatus(house: House, status: LiveStatus): House {
  return {
    ...house,
    meterStatus: status.meterStatus,
    lastHeartbeatAt:
      status.meterStatus === 'online' ? status.lastHeartbeatAt : undefined,
  };
}

export function rangeIncludesNow(range: EnergyRange, now: Date): boolean {
  const at = now.getTime();
  return Date.parse(range.from) <= at && at < Date.parse(range.to);
}

export type LiveBadgeLabel = 'Live' | 'Connecting' | 'Reconnecting' | 'Paused';

export function liveBadgeLabel(
  state: RealtimeState,
  interrupted: boolean,
): LiveBadgeLabel {
  if (interrupted || state === 'reconnecting') return 'Reconnecting';
  if (state === 'live') return 'Live';
  if (state === 'paused' || state === 'offline') return 'Paused';
  return 'Connecting';
}

/** Whether the gateway reported that its feed from the IoT service is down. */
const useLiveStreamStore = create<{ interrupted: boolean }>(() => ({
  interrupted: false,
}));

export function useLiveBadgeLabel(): LiveBadgeLabel {
  const state = useRealtimeStore((s) => s.state);
  const interrupted = useLiveStreamStore((s) => s.interrupted);
  return liveBadgeLabel(state, interrupted);
}

function isRange(value: unknown): value is EnergyRange {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as EnergyRange).from === 'string' &&
    typeof (value as EnergyRange).to === 'string'
  );
}

/*
 * Keeps the house's cached data live: readings replace the latest reading,
 * status changes update the house, and today's totals are refetched at most
 * once a minute. After every (re)subscribe it resyncs over REST, because
 * events are not replayed. Call once, for the selected house.
 */
export function useLiveHouse(houseId: string | undefined): void {
  const queryClient = useQueryClient();
  const lastRefresh = useRef(0);

  useEffect(() => {
    useLiveStreamStore.setState({ interrupted: false });
  }, [houseId]);

  useRealtimeTopic(houseId ? houseTopic(houseId) : undefined, (message) => {
    if (houseId) handle(houseId, message);
  });

  function resync(id: string) {
    lastRefresh.current = Date.now();
    void queryClient.invalidateQueries({
      queryKey: ['iot', 'latest-reading', id],
    });
    void queryClient.invalidateQueries({ queryKey: ['iot', 'houses'] });
    void queryClient.invalidateQueries({ queryKey: ['iot', 'house', id] });
  }

  function refreshToday(id: string) {
    const now = new Date();
    if (now.getTime() - lastRefresh.current < SUMMARY_REFRESH_MS) return;
    lastRefresh.current = now.getTime();

    void queryClient.invalidateQueries({
      // Only on-screen queries are refetched; others are just marked stale.
      predicate: (query: Query) => {
        const [scope, kind, queryHouseId, range] = query.queryKey;
        return (
          scope === 'iot' &&
          (kind === 'energy-summary' || kind === 'energy-series') &&
          queryHouseId === id &&
          isRange(range) &&
          rangeIncludesNow(range, now)
        );
      },
    });
  }

  function handle(id: string, message: TopicMessage) {
    if (message.kind === 'subscribed') {
      useLiveStreamStore.setState({ interrupted: false });
      resync(id);
      return;
    }
    if (message.kind !== 'event') return;

    switch (message.event) {
      case 'reading': {
        const parsed = readingSchema.safeParse(message.payload);
        if (!parsed.success) return;
        queryClient.setQueryData<MeterReading | null>(
          ['iot', 'latest-reading', id],
          (current) => applyLiveReading(current, parsed.data),
        );
        refreshToday(id);
        return;
      }
      case 'status': {
        const parsed = statusSchema.safeParse(message.payload);
        if (!parsed.success) return;
        const update = (house: House) =>
          house.houseId === id ? applyLiveStatus(house, parsed.data) : house;
        queryClient.setQueryData<{ houses: Array<House> }>(
          ['iot', 'houses'],
          (data) => data && { houses: data.houses.map(update) },
        );
        queryClient.setQueryData<{
          house: House;
          flexibleAssets: Array<FlexibleAsset>;
        }>(
          ['iot', 'house', id],
          (data) => data && { ...data, house: update(data.house) },
        );
        return;
      }
      case 'stream-state': {
        const parsed = streamStateSchema.safeParse(message.payload);
        if (!parsed.success) return;
        const interrupted = parsed.data.state === 'interrupted';
        useLiveStreamStore.setState({ interrupted });
        if (!interrupted) resync(id);
        return;
      }
    }
  }
}
