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

/** Zone label plus the house switcher for the Energy page. */
export function useEnergyMeta() {
  const selected = useSelectedHouse();
  const house = selected.house;
  return {
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
  const previous = previousRange(range);
  const current = useEnergySummary(houseId, range);
  const before = useEnergySummary(houseId, previous);
  // FIX-HANAN: sample value, needs tariff/settlement data.
  const savings = energyKpis.find((kpi) => kpi.label === 'Est. savings');

  return {
    status: queryStatus(selected, current),
    kpis: current.data
      ? [
          ...toKpis(current.data, before.data, MARKET_TIME_ZONE),
          ...(savings ? [savings] : []),
        ]
      : [],
    balance: current.data
      ? {
          ...toEnergyBalance(current.data),
          // FIX-HANAN: sample value, needs tariff/settlement data.
          exportEarnings: energyBalance.exportEarnings,
        }
      : null,
    retry: current.refetch,
  };
}

// FIX-HANAN: sample values, no appliance-level metering or insights service yet.
export function useEnergySamples() {
  return { categories: usageCategories, insights: energyInsights };
}

export function useEnergySeriesData(range: EnergySeriesRange) {
  const selected = useSelectedHouse();
  const series = useEnergySeries(selected.house?.houseId, range);
  return {
    status: queryStatus(selected, series),
    buckets: series.data ?? [],
    fetchedAt: new Date(series.dataUpdatedAt).toISOString(),
    retry: series.refetch,
  };
}

const FORECAST_FIRST_HOUR = 6;

// FIX-HANAN: forecast curve and accuracy are sample values, no forecast service yet.
export function useForecastSeries() {
  const selected = useSelectedHouse();
  const today = {
    ...todayRange(new Date(), MARKET_TIME_ZONE),
    bucket: '1h' as const,
    timeZone: MARKET_TIME_ZONE,
  };
  const actual = useEnergySeries(selected.house?.houseId, today);
  const ratedKw = selected.house?.ratedSolarKw ?? 1;

  const dayStart = new Date(today.from).getTime();
  const forecast = forecastSeries.map((share, index): [string, number] => [
    new Date(
      dayStart + (FORECAST_FIRST_HOUR + index) * 3_600_000,
    ).toISOString(),
    Math.round(share * ratedKw * 100) / 100,
  ]);

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
  const range = lastWeeksRange(PEAK_WEEKS, new Date(), MARKET_TIME_ZONE);
  const series = useEnergySeries(selected.house?.houseId, range);
  const matrix = toPeakMatrix(series.data ?? [], MARKET_TIME_ZONE);
  return {
    status: queryStatus(selected, series),
    matrix,
    retry: series.refetch,
  };
}

// FIX-HANAN: sample devices, the IoT service doesn't report chargers or flexible loads yet.
const sampleAssets: Array<AssetView> = energyAssets.filter(
  (asset) => asset.category === 'Charger' || asset.category === 'Flex loads',
);

export function useEnergyAssets() {
  const selected = useSelectedHouse();
  const houseId = selected.house?.houseId;
  const details = useHouseDetails(houseId);
  const latest = useLatestReading(houseId);
  const now = new Date(latest.dataUpdatedAt);
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
