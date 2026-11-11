import { MARKET_TIME_ZONE } from '#/data/currency';
import { dashboardView } from '#/data/dashboard';
import { useAuthUser } from '#/features/auth/hooks';
import {
  queryStatus,
  useEnergySeries,
  useEnergySummary,
  useHouseDetails,
  useLatestReading,
  useSelectedHouse,
} from '#/features/iot/hooks';
import { rangeFor, todayRange } from '#/features/iot/time-range';
import type { EnergyPeriod } from '#/features/iot/time-range';
import {
  batterySoc,
  dashboardGreeting,
  meterSyncActivity,
  toDeviceCards,
  toEnergyPosition,
  toFlowTiles,
} from '#/features/iot/view-model';
import { formatKw } from '#/lib/energy-format';
import { getFirstName } from '#/lib/user';

/**
 * Dashboard data: live IoT data for the selected house, plus the demo data
 * of cards owned by other services (wallet, trading, market).
 */
export function useDashboard() {
  const { data: user } = useAuthUser();
  const selected = useSelectedHouse();
  const houseId = selected.house?.houseId;
  const now = new Date();
  const today = todayRange(now, MARKET_TIME_ZONE);

  const details = useHouseDetails(houseId);
  const latest = useLatestReading(houseId);
  const summary = useEnergySummary(houseId, today);
  const reading = latest.data ?? null;

  const readingStatus = queryStatus(selected, latest, latest.data === null);
  const summaryStatus = queryStatus(selected, summary);
  const greeting = dashboardGreeting(now, MARKET_TIME_ZONE);
  const firstName = user ? getFirstName(user.name || user.email) : '';
  const otherActivity = dashboardView.activity.filter(
    (item) => item.title !== 'Meter sync',
  );

  return {
    source: 'live' as const,
    greeting: `${greeting.phrase}${firstName ? `, ${firstName}` : ''} ${greeting.emoji}`,
    subtitle: rangeFor('Day', now, MARKET_TIME_ZONE).label,
    position: {
      status: summaryStatus,
      value: summary.data ? toEnergyPosition(summary.data) : null,
      retry: summary.refetch,
    },
    devices: {
      status: readingStatus,
      cards:
        selected.house && reading
          ? toDeviceCards(
              selected.house,
              reading,
              details.data?.flexibleAssets ?? [],
            )
          : [],
      retry: latest.refetch,
    },
    flow: {
      status: readingStatus,
      tiles: reading ? toFlowTiles(reading) : [],
      retry: latest.refetch,
    },
    stats: dashboardView.stats.map((stat) =>
      stat.label === 'Battery SoC'
        ? { ...stat, value: (reading && batterySoc(reading)) ?? '—' }
        : stat,
    ),
    actions: dashboardView.actions,
    slot: {
      ...dashboardView.slot,
      exportKw: reading ? `${formatKw(Math.max(reading.netKw, 0))} kW` : '—',
    },
    activity:
      reading && summary.data
        ? [
            meterSyncActivity(
              reading,
              summary.data.totals.generatedKwh,
              MARKET_TIME_ZONE,
            ),
            ...otherActivity,
          ]
        : otherActivity,
    market: dashboardView.market,
  };
}

export type GenerationPeriod = Exclude<EnergyPeriod, 'Custom'>;

export function useGenerationSeries(period: GenerationPeriod) {
  const selected = useSelectedHouse();
  const { from, to, bucket } = rangeFor(period, new Date(), MARKET_TIME_ZONE);
  const range = { from, to, bucket, timeZone: MARKET_TIME_ZONE };
  const series = useEnergySeries(selected.house?.houseId, range);

  return {
    status: queryStatus(selected, series),
    buckets: series.data ?? [],
    range,
    retry: series.refetch,
  };
}
