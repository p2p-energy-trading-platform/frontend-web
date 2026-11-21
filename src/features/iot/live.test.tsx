// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TopicListener } from '#/lib/realtime/client';
import type { House, MeterReading } from './api';
import {
  applyLiveReading,
  applyLiveStatus,
  liveBadgeLabel,
  rangeIncludesNow,
  useLiveBadgeLabel,
  useLiveHouse,
} from './live';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

// The test plays the gateway: it calls the listener useLiveHouse registered.
const subscriptions = new Map<string, TopicListener>();
vi.mock('#/lib/realtime/use-topic', () => ({
  useRealtimeTopic: (topic: string | undefined, listener: TopicListener) => {
    if (topic) subscriptions.set(topic, listener);
  },
}));

const HOUSE_ID = 'grid01-house0003';
const TOPIC = `iot.house.${HOUSE_ID}`;

function reading(
  measuredAt: string,
  seq: number,
  overrides: Partial<MeterReading> = {},
): MeterReading {
  return {
    meterId: 'SM-784',
    measuredAt,
    seq,
    solarKw: 1.4,
    consumptionKw: 0.9,
    netKw: 0.5,
    storageAssets: [],
    ...overrides,
  };
}

const house: House = {
  houseId: HOUSE_ID,
  grid: { gridId: 'grid01', displayName: 'Grid 01' },
  meterId: 'SM-784',
  deviceClass: 'residential_prosumer',
  meterStatus: 'online',
  lastHeartbeatAt: '2026-11-20T09:00:00.000Z',
};

describe('applyLiveReading', () => {
  const current = reading('2026-11-20T09:30:05.000Z', 10);

  it('takes a reading measured later', () => {
    const later = reading('2026-11-20T09:30:10.000Z', 1);
    expect(applyLiveReading(current, later)).toBe(later);
  });

  it('takes a higher sequence measured at the same time', () => {
    const next = reading('2026-11-20T09:30:05.000Z', 11);
    expect(applyLiveReading(current, next)).toBe(next);
  });

  it.each([
    ['measured earlier', reading('2026-11-20T09:30:00.000Z', 99)],
    ['the same reading again', reading('2026-11-20T09:30:05.000Z', 10)],
    [
      'a lower sequence at the same time',
      reading('2026-11-20T09:30:05.000Z', 9),
    ],
  ])('keeps the current reading over one %s', (_name, incoming) => {
    expect(applyLiveReading(current, incoming)).toBe(current);
  });

  it('takes any reading when there is none yet', () => {
    expect(applyLiveReading(null, current)).toBe(current);
    expect(applyLiveReading(undefined, current)).toBe(current);
  });
});

describe('applyLiveStatus', () => {
  it('marks the house offline and drops the heartbeat time', () => {
    expect(applyLiveStatus(house, { meterStatus: 'offline' })).toEqual({
      ...house,
      meterStatus: 'offline',
      lastHeartbeatAt: undefined,
    });
  });

  it('marks the house online with the new heartbeat time', () => {
    const offline: House = {
      ...house,
      meterStatus: 'offline',
      lastHeartbeatAt: undefined,
    };
    expect(
      applyLiveStatus(offline, {
        meterStatus: 'online',
        lastHeartbeatAt: '2026-11-20T10:00:00.000Z',
      }),
    ).toEqual({ ...house, lastHeartbeatAt: '2026-11-20T10:00:00.000Z' });
  });
});

describe('rangeIncludesNow', () => {
  const range = {
    from: '2026-11-19T20:00:00.000Z',
    to: '2026-11-20T20:00:00.000Z',
  };

  it.each([
    ['the start', '2026-11-19T20:00:00.000Z', true],
    ['the middle', '2026-11-20T09:30:00.000Z', true],
    ['the end (exclusive)', '2026-11-20T20:00:00.000Z', false],
    ['before', '2026-11-19T19:59:59.000Z', false],
  ])('%s', (_name, now, expected) => {
    expect(rangeIncludesNow(range, new Date(now))).toBe(expected);
  });
});

describe('liveBadgeLabel', () => {
  it.each([
    ['live', false, 'Live'],
    ['live', true, 'Reconnecting'],
    ['reconnecting', false, 'Reconnecting'],
    ['connecting', false, 'Connecting'],
    ['idle', false, 'Connecting'],
    ['paused', false, 'Paused'],
    ['offline', false, 'Paused'],
  ] as const)('%s, interrupted %s → %s', (state, interrupted, label) => {
    expect(liveBadgeLabel(state, interrupted)).toBe(label);
  });
});

describe('useLiveHouse', () => {
  let client: QueryClient;

  const now = new Date('2026-11-20T09:30:00.000Z');
  const today = {
    from: '2026-11-19T20:00:00.000Z',
    to: '2026-11-20T20:00:00.000Z',
  };
  const yesterday = {
    from: '2026-11-18T20:00:00.000Z',
    to: '2026-11-19T20:00:00.000Z',
  };

  function render() {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    return renderHook(() => useLiveHouse(HOUSE_ID), { wrapper });
  }

  function send(message: Parameters<TopicListener>[0]) {
    const listener = subscriptions.get(TOPIC);
    if (!listener) throw new Error(`nothing subscribed to ${TOPIC}`);
    act(() => listener(message));
  }

  function isInvalidated(key: ReadonlyArray<unknown>) {
    return client.getQueryState(key)?.isInvalidated ?? false;
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(now);
    subscriptions.clear();
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client.setQueryData(
      ['iot', 'latest-reading', HOUSE_ID],
      reading('2026-11-20T09:29:55.000Z', 5),
    );
    client.setQueryData(['iot', 'houses'], { houses: [house] });
    client.setQueryData(['iot', 'house', HOUSE_ID], {
      house,
      flexibleAssets: [],
    });
    client.setQueryData(['iot', 'energy-summary', HOUSE_ID, today], {
      totals: {},
    });
    client.setQueryData(['iot', 'energy-summary', HOUSE_ID, yesterday], {
      totals: {},
    });
    client.setQueryData(
      [
        'iot',
        'energy-series',
        HOUSE_ID,
        { ...today, bucket: '1h', timeZone: 'Asia/Dubai' },
      ],
      { buckets: [] },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('subscribes to the house’s topic', () => {
    render();
    expect([...subscriptions.keys()]).toEqual([TOPIC]);
  });

  it('does not subscribe without a house', () => {
    renderHook(() => useLiveHouse(undefined), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });
    expect(subscriptions.size).toBe(0);
  });

  it('stores a newer reading as the latest reading', () => {
    render();
    const live = reading('2026-11-20T09:30:00.000Z', 6, { solarKw: 2.2 });

    send({ kind: 'event', event: 'reading', payload: live });

    expect(client.getQueryData(['iot', 'latest-reading', HOUSE_ID])).toEqual(
      live,
    );
  });

  it('ignores an older or malformed reading', () => {
    render();
    const before = client.getQueryData(['iot', 'latest-reading', HOUSE_ID]);

    send({
      kind: 'event',
      event: 'reading',
      payload: reading('2026-11-20T09:00:00.000Z', 1),
    });
    send({ kind: 'event', event: 'reading', payload: { seq: 'nope' } });

    expect(client.getQueryData(['iot', 'latest-reading', HOUSE_ID])).toBe(
      before,
    );
  });

  it('applies a status change to the house list and the house', () => {
    render();

    send({
      kind: 'event',
      event: 'status',
      payload: { meterStatus: 'offline' },
    });

    expect(
      client.getQueryData<{ houses: Array<House> }>(['iot', 'houses'])
        ?.houses[0]?.meterStatus,
    ).toBe('offline');
    expect(
      client.getQueryData<{ house: House }>(['iot', 'house', HOUSE_ID])?.house
        .meterStatus,
    ).toBe('offline');
  });

  it('resyncs the latest reading and the house over REST after subscribing', () => {
    render();

    send({ kind: 'subscribed' });

    expect(isInvalidated(['iot', 'latest-reading', HOUSE_ID])).toBe(true);
    expect(isInvalidated(['iot', 'houses'])).toBe(true);
    expect(isInvalidated(['iot', 'house', HOUSE_ID])).toBe(true);
  });

  it('refreshes today’s totals at most once a minute while readings arrive', () => {
    render();
    send({ kind: 'subscribed' });
    const todayKey = ['iot', 'energy-summary', HOUSE_ID, today];
    client.setQueryData(todayKey, { totals: {} });

    send({
      kind: 'event',
      event: 'reading',
      payload: reading('2026-11-20T09:30:05.000Z', 6),
    });
    expect(isInvalidated(todayKey)).toBe(false);

    vi.setSystemTime(new Date(now.getTime() + 60_000));
    send({
      kind: 'event',
      event: 'reading',
      payload: reading('2026-11-20T09:31:00.000Z', 7),
    });

    expect(isInvalidated(todayKey)).toBe(true);
    expect(
      isInvalidated([
        'iot',
        'energy-series',
        HOUSE_ID,
        { ...today, bucket: '1h', timeZone: 'Asia/Dubai' },
      ]),
    ).toBe(true);
    expect(isInvalidated(['iot', 'energy-summary', HOUSE_ID, yesterday])).toBe(
      false,
    );
  });

  it('tracks whether the gateway’s feed is interrupted', () => {
    render();
    const { result } = renderHook(() => useLiveBadgeLabel());

    send({
      kind: 'event',
      event: 'stream-state',
      payload: { state: 'interrupted' },
    });
    expect(result.current).toBe('Reconnecting');

    send({ kind: 'event', event: 'stream-state', payload: { state: 'live' } });
    expect(isInvalidated(['iot', 'latest-reading', HOUSE_ID])).toBe(true);
  });
});
