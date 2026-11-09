import { queryOptions, useQuery } from '@tanstack/react-query';

import { ApiError } from '#/lib/api-client';
import {
  getEnergySeries,
  getEnergySummary,
  getHouse,
  getLatestReading,
  listHouses,
} from './api';
import type { EnergyRange, EnergySeriesRange, House } from './api';
import { useSelectedHouseStore } from './selected-house-store';
import { iotStatus } from './status';
import type { IotStatus } from './status';

export const housesQueryOptions = queryOptions({
  queryKey: ['iot', 'houses'] as const,
  queryFn: listHouses,
  select: (data) => data.houses,
});

export function houseQueryOptions(houseId: string | undefined) {
  return queryOptions({
    queryKey: ['iot', 'house', houseId] as const,
    queryFn: () => getHouse(houseId as string),
    enabled: Boolean(houseId),
  });
}

export function latestReadingQueryOptions(houseId: string | undefined) {
  return queryOptions({
    queryKey: ['iot', 'latest-reading', houseId] as const,
    // A house that has not reported yet has no latest reading (404).
    queryFn: async () => {
      try {
        return await getLatestReading(houseId as string);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: Boolean(houseId),
  });
}

export function energySeriesQueryOptions(
  houseId: string | undefined,
  range: EnergySeriesRange,
) {
  return queryOptions({
    queryKey: ['iot', 'energy-series', houseId, range] as const,
    queryFn: () => getEnergySeries(houseId as string, range),
    enabled: Boolean(houseId),
    select: (data) => data.buckets,
  });
}

export function energySummaryQueryOptions(
  houseId: string | undefined,
  range: EnergyRange,
) {
  return queryOptions({
    queryKey: ['iot', 'energy-summary', houseId, range] as const,
    queryFn: () => getEnergySummary(houseId as string, range),
    enabled: Boolean(houseId),
  });
}

/** The stored house if the user still owns it, else their first house. */
export function resolveSelectedHouse(
  houses: Array<House>,
  storedHouseId: string | null,
): House | null {
  return (
    houses.find((house) => house.houseId === storedHouseId) ??
    houses.at(0) ??
    null
  );
}

export function useHouses() {
  return useQuery(housesQueryOptions);
}

export function useSelectedHouse() {
  const houses = useHouses();
  const storedHouseId = useSelectedHouseStore((state) => state.houseId);
  const setHouseId = useSelectedHouseStore((state) => state.setHouseId);
  const list = houses.data ?? [];

  return {
    house: resolveSelectedHouse(list, storedHouseId),
    houses: list,
    setHouseId,
    isLoading: houses.isLoading,
    error: houses.error,
    refetch: houses.refetch,
  };
}

export function useHouseDetails(houseId: string | undefined) {
  return useQuery(houseQueryOptions(houseId));
}

export function useLatestReading(houseId: string | undefined) {
  return useQuery(latestReadingQueryOptions(houseId));
}

export function useEnergySeries(
  houseId: string | undefined,
  range: EnergySeriesRange,
) {
  return useQuery(energySeriesQueryOptions(houseId, range));
}

export function useEnergySummary(
  houseId: string | undefined,
  range: EnergyRange,
) {
  return useQuery(energySummaryQueryOptions(houseId, range));
}

/** The card state for a query that belongs to the selected house. */
export function queryStatus(
  selected: Pick<
    ReturnType<typeof useSelectedHouse>,
    'house' | 'isLoading' | 'error'
  >,
  query: { isPending: boolean; isError: boolean },
  missing = false,
): IotStatus {
  return iotStatus({
    housesLoading: selected.isLoading,
    housesFailed: Boolean(selected.error),
    hasHouse: selected.house !== null,
    loading: query.isPending,
    failed: query.isError,
    missing,
  });
}
