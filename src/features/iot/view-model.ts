import {
  ArrowDownLeft,
  ArrowUpRight,
  BatteryCharging,
  Car,
  Gauge,
  Home,
  Percent,
  Sun,
  Zap,
} from 'lucide-react';

import type { DeviceCardProps } from '#/components/dashboard/DeviceCard';
import type { EnergyPositionCardProps } from '#/components/dashboard/EnergyPositionCard';
import type { FlowTile } from '#/components/dashboard/LiveEnergyFlowCard';
import type { ActivityItem } from '#/components/dashboard/RecentActivityCard';
import type { AssetCardProps } from '#/components/energy-assets/AssetCard';
import type { AssetCategory } from '#/components/energy-assets/AssetFilterBar';
import type { EnergyBalanceCardProps } from '#/components/energy-assets/EnergyBalanceCard';
import type { EnergyKpi } from '#/components/energy-assets/EnergyKPIStrip';
import {
  formatKw,
  formatKwh,
  formatPercent,
  formatRelativeTime,
} from '#/lib/energy-format';
import type {
  EnergyBucket,
  EnergySummary,
  FlexibleAsset,
  House,
  MeterReading,
  StorageAssetReading,
} from './api';

const round1 = (value: number) => Math.round(value * 10) / 10;

/** The grid's display name, or its ID while the name isn't configured. */
export function gridLabel(house: House) {
  return house.grid.displayName.trim() || house.grid.gridId;
}

export function solarStatus(solarKw: number) {
  return solarKw > 0 ? 'Generating' : 'Idle';
}

export function storageStatus(powerKw: number) {
  if (powerKw > 0) return 'Charging';
  if (powerKw < 0) return 'Discharging';
  return 'Idle';
}

function localTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
}

// ---------------------------------------------------------------- dashboard

export function toEnergyPosition(
  summary: EnergySummary,
): EnergyPositionCardProps {
  const { totals } = summary;
  return {
    // Not rounded: the card formats it, and rounding a small import to -0 would read as a surplus.
    netKwh: totals.exportedKwh - totals.importedKwh,
    generatedKwh: round1(totals.generatedKwh),
    consumedKwh: round1(totals.consumedKwh),
    exportedKwh: round1(totals.exportedKwh),
    importedKwh: round1(totals.importedKwh),
  };
}

function storageDeviceCard(
  storage: StorageAssetReading,
  registered: FlexibleAsset | undefined,
): DeviceCardProps {
  const status = storageStatus(storage.powerKw);
  if (storage.assetType === 'ev') {
    const plug = storage.pluggedIn ? 'Plugged in' : 'Unplugged';
    return {
      icon: Car,
      iconWrapClassName: 'bg-chart-4/12 text-chart-4',
      title: 'EV',
      subtitle: registered?.v2gCapable ? `${plug} · V2G ready` : plug,
      statusLabel: status,
      value: formatKw(Math.abs(storage.powerKw)),
      valueLabel: 'kW',
      progressPercent: Math.round(storage.socPct),
    };
  }
  return {
    icon: BatteryCharging,
    iconWrapClassName: 'bg-accent/12 text-accent',
    title: 'Home Battery',
    subtitle: `${round1(storage.capacityKwh)} kWh`,
    statusLabel: status,
    value: formatKw(Math.abs(storage.powerKw)),
    valueLabel: 'kW',
    progressPercent: Math.round(storage.socPct),
  };
}

export function toDeviceCards(
  house: House,
  reading: MeterReading,
  assets: Array<FlexibleAsset>,
): Array<DeviceCardProps> {
  const solar: DeviceCardProps = {
    icon: Sun,
    iconWrapClassName: 'bg-chart-3/12 text-chart-3',
    title: 'Solar PV',
    subtitle:
      house.ratedSolarKw === undefined
        ? 'Rooftop'
        : `Rooftop · ${round1(house.ratedSolarKw)} kWp`,
    statusLabel: solarStatus(reading.solarKw),
    value: formatKw(reading.solarKw),
    valueLabel: 'kW',
  };
  return [
    solar,
    ...reading.storageAssets.map((storage) =>
      storageDeviceCard(
        storage,
        assets.find((asset) => asset.assetId === storage.assetId),
      ),
    ),
  ];
}

function batteryPowerKw(reading: MeterReading) {
  const batteries = reading.storageAssets.filter((s) => s.assetType === 'bess');
  if (batteries.length === 0) return null;
  return batteries.reduce((sum, battery) => sum + battery.powerKw, 0);
}

export function toFlowTiles(reading: MeterReading): Array<FlowTile> {
  const tiles: Array<FlowTile> = [
    {
      icon: Sun,
      label: 'Solar PV',
      value: `${formatKw(reading.solarKw)} kW`,
      tone: 'warning',
    },
    {
      icon: Home,
      label: 'Home',
      value: `${formatKw(reading.consumptionKw)} kW`,
      tone: 'default',
    },
  ];

  const battery = batteryPowerKw(reading);
  if (battery !== null) {
    const arrow = battery > 0 ? ' ↑' : battery < 0 ? ' ↓' : '';
    tiles.push({
      icon: BatteryCharging,
      label: 'Battery',
      value: `${formatKw(Math.abs(battery))} kW${arrow}`,
      tone: 'primary',
    });
  }

  tiles.push(
    reading.netKw < 0
      ? {
          icon: ArrowDownLeft,
          label: 'Grid import',
          value: `${formatKw(-reading.netKw)} kW`,
          tone: 'info',
        }
      : {
          icon: ArrowUpRight,
          label: 'Grid export',
          value: `${formatKw(reading.netKw)} kW`,
          tone: 'info',
        },
  );
  return tiles;
}

export function batterySoc(reading: MeterReading) {
  const battery = reading.storageAssets.find((s) => s.assetType === 'bess');
  return battery ? `${Math.round(battery.socPct)}%` : null;
}

export function meterSyncActivity(
  reading: MeterReading,
  generatedTodayKwh: number,
  timeZone: string,
): ActivityItem {
  return {
    icon: Zap,
    iconClassName: 'bg-secondary text-text-secondary',
    title: 'Meter sync',
    subtitle: `${reading.meterId} · latest reading`,
    amount: `${formatKwh(generatedTodayKwh)} kWh`,
    time: localTime(reading.measuredAt, timeZone),
  };
}

// -------------------------------------------------------------- energy page

function trendVsPrevious(
  current: number,
  previous: number | undefined,
  unit = '',
) {
  if (previous === undefined) return '';
  const delta = current - previous;
  return `${delta > 0 ? '+' : ''}${formatKwh(delta)}${unit} vs previous`;
}

function trendClass(delta: number, higherIsBetter: boolean) {
  return delta === 0 || delta > 0 === higherIsBetter
    ? 'text-accent'
    : 'text-chart-4';
}

export function toKpis(
  summary: EnergySummary,
  previous: EnergySummary | undefined,
  timeZone: string,
): Array<EnergyKpi> {
  const { totals } = summary;
  const before = previous?.totals;

  const energyKpi = (
    icon: EnergyKpi['icon'],
    iconClassName: string,
    label: string,
    value: number,
    previousValue: number | undefined,
    higherIsBetter: boolean,
  ): EnergyKpi => ({
    icon,
    iconClassName,
    value: formatKwh(value),
    unit: 'kWh',
    label,
    trend: trendVsPrevious(value, previousValue),
    trendClassName:
      previousValue === undefined
        ? undefined
        : trendClass(value - previousValue, higherIsBetter),
  });

  const selfUse = summary.selfConsumptionPct;
  const selfUseBefore = previous?.selfConsumptionPct;
  const peak = summary.peakDemand;

  return [
    energyKpi(
      Sun,
      'bg-chart-3/12 text-chart-3',
      'Solar generation',
      totals.generatedKwh,
      before?.generatedKwh,
      true,
    ),
    energyKpi(
      Zap,
      'bg-chart-4/12 text-chart-4',
      'Household consumption',
      totals.consumedKwh,
      before?.consumedKwh,
      false,
    ),
    {
      icon: Percent,
      iconClassName: 'bg-accent/12 text-accent',
      value: selfUse === undefined ? '—' : formatPercent(selfUse),
      unit: '%',
      label: 'Self-consumption',
      trend:
        selfUse === undefined
          ? 'No solar generated'
          : trendVsPrevious(selfUse, selfUseBefore, ' pts'),
      trendClassName:
        selfUse === undefined || selfUseBefore === undefined
          ? undefined
          : trendClass(selfUse - selfUseBefore, true),
    },
    energyKpi(
      ArrowDownLeft,
      'bg-chart-4/12 text-chart-4',
      'Grid import',
      totals.importedKwh,
      before?.importedKwh,
      false,
    ),
    energyKpi(
      ArrowUpRight,
      'bg-accent/12 text-accent',
      'Grid export',
      totals.exportedKwh,
      before?.exportedKwh,
      true,
    ),
    {
      icon: Gauge,
      iconClassName: 'bg-chart-3/12 text-chart-3',
      value: peak ? formatKw(peak.consumptionKw) : '—',
      unit: 'kW',
      label: 'Peak demand',
      trend: peak
        ? `${localTime(peak.occurredAt, timeZone)} GST`
        : 'No readings',
    },
  ];
}

function widths(values: Array<number>) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return values.map((value) =>
    total > 0 ? Math.round((value / total) * 100) : 0,
  );
}

function sourceRow(
  icon: EnergyKpi['icon'],
  iconClassName: string,
  label: string,
  splits: Array<[string, number]>,
) {
  const values = splits.map(([, value]) => value);
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    icon,
    iconClassName,
    label,
    total: `${formatKwh(total)} kWh`,
    segmentWidths: widths(values),
    splits: splits.map(([splitLabel, value]) => ({
      label: splitLabel,
      value: `${formatKwh(value)} kWh`,
    })),
  };
}

export function toEnergyBalance(
  summary: EnergySummary,
): Pick<EnergyBalanceCardProps, 'summary' | 'sources'> {
  const { totals, flows, selfConsumptionPct } = summary;
  return {
    summary: [
      {
        icon: Sun,
        iconClassName: 'bg-chart-3/12 text-chart-3',
        value: `${formatKwh(totals.generatedKwh)} kWh`,
        label: 'Generated',
      },
      {
        icon: Zap,
        iconClassName: 'bg-chart-4/12 text-chart-4',
        value: `${formatKwh(totals.consumedKwh)} kWh`,
        label: 'Consumed',
      },
      {
        icon: Percent,
        iconClassName: 'bg-accent/12 text-accent',
        value:
          selfConsumptionPct === undefined
            ? '—'
            : `${formatPercent(selfConsumptionPct)}%`,
        label: 'Self-use',
      },
    ],
    sources: [
      sourceRow(Sun, 'bg-chart-3/12 text-chart-3', 'Solar', [
        ['Home (direct)', flows.solarToHomeKwh],
        ['Battery charge', flows.solarToStorageKwh],
        ['Grid export', flows.solarToGridKwh],
      ]),
      sourceRow(ArrowDownLeft, 'bg-secondary text-text-secondary', 'Grid', [
        ['Home (import)', flows.gridToHomeKwh],
        ['Battery charge', flows.gridToStorageKwh],
      ]),
      sourceRow(BatteryCharging, 'bg-accent/12 text-accent', 'Battery', [
        ['Home', flows.storageToHomeKwh],
        ['Grid export', flows.storageToGridKwh],
      ]),
    ],
  };
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface PeakMatrix {
  days: Array<string>;
  /** [hour 0-23, weekday index Mon=0, average consumption kW] */
  cells: Array<[number, number, number]>;
  max: number;
}

/** Average consumption per local weekday and hour, from hourly buckets. */
export function toPeakMatrix(
  buckets: Array<EnergyBucket>,
  timeZone: string,
): PeakMatrix {
  const format = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  });
  const sums = new Map<string, { total: number; count: number }>();

  for (const bucket of buckets) {
    const parts = format.formatToParts(new Date(bucket.startsAt));
    const day = WEEKDAYS.indexOf(
      parts.find((p) => p.type === 'weekday')?.value ?? '',
    );
    const hour = Number(parts.find((p) => p.type === 'hour')?.value);
    const key = `${hour}:${day}`;
    const entry = sums.get(key) ?? { total: 0, count: 0 };
    entry.total += bucket.averagePower.consumptionKw;
    entry.count += 1;
    sums.set(key, entry);
  }

  const cells = [...sums].map(
    ([key, { total, count }]): [number, number, number] => {
      const [hour, day] = key.split(':').map(Number);
      return [hour, day, round1(total / count)];
    },
  );
  return {
    days: WEEKDAYS,
    cells,
    max: cells.reduce((max, [, , value]) => Math.max(max, value), 0),
  };
}

export function seriesToCsv(buckets: Array<EnergyBucket>) {
  const rows = buckets.map(({ startsAt, energy }) =>
    [
      startsAt,
      energy.generatedKwh,
      energy.consumedKwh,
      energy.exportedKwh,
      energy.importedKwh,
    ]
      .map((value) => (typeof value === 'number' ? value.toFixed(3) : value))
      .join(','),
  );
  return `starts_at,generated_kwh,consumed_kwh,exported_kwh,imported_kwh\n${rows.map((row) => `${row}\n`).join('')}`;
}

// ------------------------------------------------------------------- assets

export type AssetView = AssetCardProps & {
  category: Exclude<AssetCategory, 'All assets'>;
};

export function toAssetViews(
  house: House,
  reading: MeterReading,
  assets: Array<FlexibleAsset>,
  now: Date,
): Array<AssetView> {
  const status = house.meterStatus === 'online' ? 'Online' : 'Offline';
  const lastUpdated = formatRelativeTime(reading.measuredAt, now);

  const solar: AssetView = {
    category: 'Solar',
    icon: Sun,
    iconWrapClassName: 'bg-chart-3/12 text-chart-3',
    name: 'Rooftop Solar',
    brandModel:
      house.ratedSolarKw === undefined
        ? 'Rooftop solar'
        : `Rooftop · ${round1(house.ratedSolarKw)} kWp`,
    status,
    statValue: formatKw(reading.solarKw, 'always'),
    statValueClassName: 'text-chart-3',
    statUnit: 'kW',
    statLabel: solarStatus(reading.solarKw),
    lastUpdated,
  };

  const storage = reading.storageAssets.map((asset): AssetView => {
    const ev = asset.assetType === 'ev';
    const registered = assets.find((a) => a.assetId === asset.assetId);
    const capacity = `${round1(registered?.capacityKwh ?? asset.capacityKwh)} kWh`;
    return {
      category: ev ? 'EV' : 'Battery',
      icon: ev ? Car : BatteryCharging,
      iconWrapClassName: ev
        ? 'bg-chart-4/12 text-chart-4'
        : 'bg-accent/12 text-accent',
      name: ev ? 'Electric Vehicle' : 'Home Battery',
      brandModel: ev && registered?.v2gCapable ? `${capacity} · V2G` : capacity,
      status,
      statValue: formatKw(asset.powerKw, 'always'),
      statValueClassName: ev ? 'text-chart-4' : 'text-accent',
      statUnit: 'kW',
      statLabel: storageStatus(asset.powerKw),
      socPercent: Math.round(asset.socPct),
      lastUpdated,
    };
  });

  return [solar, ...storage];
}

// ------------------------------------------------------------------ profile

export interface AccountStatusRow {
  value: string;
  description: string;
  tone: 'success' | 'warning';
}

const TRADING_MODES: Record<House['deviceClass'], AccountStatusRow> = {
  residential_prosumer: {
    value: 'Prosumer',
    description: 'Can buy and sell verified energy',
    tone: 'success',
  },
  commercial: {
    value: 'Commercial',
    description: 'Can buy and sell verified energy',
    tone: 'success',
  },
  consumer: {
    value: 'Consumer',
    description: 'Can buy energy; selling needs solar or storage',
    tone: 'success',
  },
};

/** Trading mode and smart meter rows for the profile's account status. */
export function toAccountStatus(house: House | null | undefined) {
  if (!house) {
    const missing: AccountStatusRow = {
      value: 'Not linked',
      description: 'Link a smart meter to start trading',
      tone: 'warning',
    };
    return { tradingMode: missing, smartMeter: missing };
  }
  const online = house.meterStatus === 'online';
  return {
    tradingMode: TRADING_MODES[house.deviceClass],
    smartMeter: {
      value: online ? 'Connected' : 'Offline',
      description: online
        ? 'Smart meter is connected and reporting'
        : 'Smart meter has stopped reporting',
      tone: online ? 'success' : 'warning',
    } satisfies AccountStatusRow,
  };
}
