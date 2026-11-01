import { useMemo } from 'react';

import { MARKET_TIME_ZONE } from '#/data/currency';
import {
  energyAssets,
  energyBalance,
  energyInsights,
  energyKpis,
  forecastAccuracyPercent,
  forecastSeries,
  usageCategories,
} from '#/data/energy-assets';
import type { EnergyRange, EnergySeriesRange } from '#/features/iot/api';
import {
  queryStatus,
  useEnergySeries,
  useEnergySummary,
  useHouseDetails,
  useLatestReading,
  useSelectedHouse,
} from '#/features/iot/hooks';
import {
  lastWeeksRange,
  previousRange,
  todayRange,
} from '#/features/iot/time-range';
import {
  gridLabel,
  toAssetViews,
  toEnergyBalance,
  toKpis,
  toPeakMatrix,
} from '#/features/iot/view-model';
import type { AssetView } from '#/features/iot/view-model';

/** House, zone and meter labels plus the house switcher for the Energy page. */
export function useEnergyMeta() {
  const selected = useSelectedHouse();
  const house = selected.house;
  return {
    meterLabel: house
      ? `${house.houseId} · ${gridLabel(house)} · ${house.meterId}`
      : 'No smart meter linked',
    zoneLabel: house ? `${house.houseId} · ${gridLabel(house)}` : '—',
    houses: selected.houses,
    selectedHouseId: house?.houseId,
    setHouseId: selected.setHouseId,
  };
}

/** KPIs and energy balance for the period, compared with the one before. */
export function useEnergyOverview(range: EnergyRange) {
  const selected = useSelectedHouse();
  const houseId = selected.house?.houseId;
  const previous = useMemo(() => previousRange(range), [range]);
  const current = useEnergySummary(houseId, range);
  const before = useEnergySummary(houseId, previous);
  const savings = energyKpis.find((kpi) => kpi.label === 'Est. savings');

  return {
    status: queryStatus(selected, current),
    kpis: current.data
      ? [
          ...toKpis(current.data, before.data, MARKET_TIME_ZONE),
          ...(savings ? [{ ...savings, sample: true }] : []),
        ]
      : [],
    balance: current.data
      ? {
          ...toEnergyBalance(current.data),
          exportEarnings: energyBalance.exportEarnings,
          exportEarningsSample: true,
        }
      : null,
    retry: current.refetch,
  };
}

/** Views with no backend data yet: shown with sample data and a badge. */
export function useEnergySamples() {
  return { categories: usageCategories, insights: energyInsights };
}

export function useEnergySeriesData(range: EnergySeriesRange) {
  const selected = useSelectedHouse();
  const series = useEnergySeries(selected.house?.houseId, range);
  return {
    status: queryStatus(selected, series),
    buckets: series.data ?? [],
    retry: series.refetch,
  };
}

const FORECAST_FIRST_HOUR = 6;

/** Today's actual solar output with the sample forecast curve. */
export function useForecastSeries() {
  const selected = useSelectedHouse();
  const today = useMemo(() => {
    const range = todayRange(new Date(), MARKET_TIME_ZONE);
    return { ...range, bucket: '1h' as const, timeZone: MARKET_TIME_ZONE };
  }, []);
  const actual = useEnergySeries(selected.house?.houseId, today);
  const ratedKw = selected.house?.ratedSolarKw ?? 1;

  const forecast = useMemo(() => {
    const dayStart = new Date(today.from).getTime();
    return forecastSeries.map((share, index): [string, number] => [
      new Date(
        dayStart + (FORECAST_FIRST_HOUR + index) * 3_600_000,
      ).toISOString(),
      Math.round(share * ratedKw * 100) / 100,
    ]);
  }, [today.from, ratedKw]);

  return {
    status: queryStatus(selected, actual),
    actual: actual.data ?? [],
    forecast,
    range: today,
    accuracyPercent: forecastAccuracyPercent,
    retry: actual.refetch,
  };
}

const PEAK_WEEKS = 4;

/** Average hourly consumption by weekday over the last four weeks. */
export function usePeakPeriods() {
  const selected = useSelectedHouse();
  const range = useMemo(
    () => lastWeeksRange(PEAK_WEEKS, new Date(), MARKET_TIME_ZONE),
    [],
  );
  const series = useEnergySeries(selected.house?.houseId, range);
  const matrix = useMemo(
    () => toPeakMatrix(series.data ?? [], MARKET_TIME_ZONE),
    [series.data],
  );
  return {
    status: queryStatus(selected, series),
    matrix,
    retry: series.refetch,
  };
}

const sampleAssets: Array<AssetView> = energyAssets
  .filter(
    (asset) => asset.category === 'Charger' || asset.category === 'Flex loads',
  )
  .map((asset) => ({ ...asset, sample: true }));

/** The house's real devices, followed by sample devices the backend can't report yet. */
export function useEnergyAssets() {
  const selected = useSelectedHouse();
  const houseId = selected.house?.houseId;
  const details = useHouseDetails(houseId);
  const latest = useLatestReading(houseId);
  const now = useMemo(() => new Date(), [latest.dataUpdatedAt]);
  const reading = latest.data ?? null;

  const realAssets =
    selected.house && reading
      ? toAssetViews(
          selected.house,
          reading,
          details.data?.flexibleAssets ?? [],
          now,
        )
      : [];

  return {
    status: queryStatus(selected, latest, latest.data === null),
    assets: [...realAssets, ...sampleAssets],
    retry: latest.refetch,
  };
}
