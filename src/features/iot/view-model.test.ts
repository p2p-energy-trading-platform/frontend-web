import { describe, expect, it } from 'vitest';

import type { EnergyBucket, EnergySummary, House, MeterReading } from './api';
import {
  batterySoc,
  dashboardGreeting,
  gridLabel,
  meterSyncActivity,
  seriesToCsv,
  solarStatus,
  storageStatus,
  toAccountStatus,
  toAssetViews,
  toDeviceCards,
  toEnergyBalance,
  toEnergyPosition,
  toFlowTiles,
  toKpis,
  toPeakMatrix,
} from './view-model';

const DUBAI = 'Asia/Dubai';
const NOW = new Date('2026-11-01T10:00:00Z');

const house: House = {
  houseId: 'grid01-house0003',
  grid: { gridId: 'grid01', displayName: 'Grid 01' },
  meterId: 'meter-grid01-house0003',
  deviceClass: 'residential_prosumer',
  ratedSolarKw: 6,
  meterStatus: 'online',
  lastHeartbeatAt: '2026-11-01T09:59:30Z',
};

const reading: MeterReading = {
  meterId: 'meter-grid01-house0003',
  measuredAt: '2026-11-01T09:58:00Z',
  seq: 7,
  solarKw: 3.84,
  consumptionKw: 2.5,
  netKw: 0.14,
  storageAssets: [
    {
      assetId: 'bat-1',
      assetType: 'bess',
      socPct: 94.4,
      powerKw: 1.2,
      capacityKwh: 14,
    },
    {
      assetId: 'ev-1',
      assetType: 'ev',
      socPct: 67,
      powerKw: -3,
      capacityKwh: 75,
      pluggedIn: true,
    },
  ],
};

function totals(partial: Partial<EnergySummary['totals']> = {}) {
  return {
    generatedKwh: 0,
    consumedKwh: 0,
    exportedKwh: 0,
    importedKwh: 0,
    storageChargedKwh: 0,
    storageDischargedKwh: 0,
    ...partial,
  };
}

const flows = {
  solarToHomeKwh: 19.2,
  solarToStorageKwh: 6.4,
  solarToGridKwh: 2.8,
  gridToHomeKwh: 9.4,
  gridToStorageKwh: 0,
  storageToHomeKwh: 7.8,
  storageToGridKwh: 0,
};

const summary: EnergySummary = {
  totals: totals({
    generatedKwh: 28.4,
    consumedKwh: 36,
    exportedKwh: 2.8,
    importedKwh: 9.4,
    storageChargedKwh: 6.4,
    storageDischargedKwh: 7.8,
  }),
  flows,
  selfConsumptionPct: 90.14,
  peakDemand: { consumptionKw: 3.4, occurredAt: '2026-11-01T15:00:00Z' },
};

describe('status labels', () => {
  it('derives labels from the reading values', () => {
    expect(solarStatus(3.8)).toBe('Generating');
    expect(solarStatus(0)).toBe('Idle');
    expect(storageStatus(1.2)).toBe('Charging');
    expect(storageStatus(-0.5)).toBe('Discharging');
    expect(storageStatus(0)).toBe('Idle');
  });
});

describe('dashboard view model', () => {
  it('turns a summary into the energy position', () => {
    const position = toEnergyPosition(summary);
    expect(position.netKwh).toBeCloseTo(-6.6);
    expect(position).toMatchObject({
      generatedKwh: 28.4,
      consumedKwh: 36,
      exportedKwh: 2.8,
      importedKwh: 9.4,
    });
  });

  it('keeps a small import a deficit instead of rounding it to +0.0', () => {
    const position = toEnergyPosition({
      ...summary,
      totals: { ...summary.totals, exportedKwh: 0, importedKwh: 0.03 },
    });
    expect(position.netKwh).toBeLessThan(0);
  });

  it('builds a device card for solar and each storage asset', () => {
    const cards = toDeviceCards(house, reading, [
      {
        assetId: 'ev-1',
        assetType: 'ev',
        capacityKwh: 75,
        maxChargeKw: 11,
        maxDischargeKw: 11,
        v2gCapable: true,
      },
    ]);
    expect(
      cards.map((c) => [
        c.title,
        c.subtitle,
        c.statusLabel,
        c.value,
        c.progressPercent,
      ]),
    ).toEqual([
      ['Solar PV', 'Rooftop · 6 kWp', 'Generating', '3.8', undefined],
      ['Home Battery', '14 kWh', 'Charging', '1.2', 94],
      ['EV', 'Plugged in · V2G ready', 'Discharging', '3.0', 67],
    ]);
  });

  it('builds a solar-only card set for a house without storage', () => {
    const cards = toDeviceCards(
      { ...house, ratedSolarKw: undefined },
      { ...reading, storageAssets: [] },
      [],
    );
    expect(cards.map((c) => [c.title, c.subtitle])).toEqual([
      ['Solar PV', 'Rooftop'],
    ]);
  });

  it('shows where power is flowing right now', () => {
    expect(toFlowTiles(reading).map((t) => [t.label, t.value])).toEqual([
      ['Solar PV', '3.8 kW'],
      ['Home', '2.5 kW'],
      ['Battery', '1.2 kW ↑'],
      ['Grid export', '0.1 kW'],
    ]);
    const importing = toFlowTiles({
      ...reading,
      netKw: -2.04,
      storageAssets: [],
    });
    expect(importing.map((t) => [t.label, t.value])).toEqual([
      ['Solar PV', '3.8 kW'],
      ['Home', '2.5 kW'],
      ['Grid import', '2.0 kW'],
    ]);
  });

  it('reports battery charge only when there is a battery', () => {
    expect(batterySoc(reading)).toBe('94%');
    expect(batterySoc({ ...reading, storageAssets: [] })).toBeNull();
  });

  it('describes the latest meter sync', () => {
    expect(meterSyncActivity(reading, 12.34, DUBAI)).toMatchObject({
      title: 'Meter sync',
      subtitle: 'meter-grid01-house0003 · latest reading',
      amount: '12.3 kWh',
      time: '13:58',
    });
  });
});

describe('energy page view model', () => {
  it('compares the period with the previous one', () => {
    const previous: EnergySummary = {
      totals: totals({
        generatedKwh: 26.3,
        consumedKwh: 33.2,
        exportedKwh: 3,
        importedKwh: 10.6,
      }),
      flows,
      selfConsumptionPct: 86.1,
    };
    const kpis = toKpis(summary, previous, DUBAI);
    expect(kpis.map((k) => [k.label, k.value, k.unit, k.trend])).toEqual([
      ['Solar generation', '28.4', 'kWh', '+2.1 vs previous'],
      ['Household consumption', '36.0', 'kWh', '+2.8 vs previous'],
      ['Self-consumption', '90.1', '%', '+4.0 pts vs previous'],
      ['Grid import', '9.4', 'kWh', '-1.2 vs previous'],
      ['Grid export', '2.8', 'kWh', '-0.2 vs previous'],
      ['Peak demand', '3.4', 'kW', '19:00 GST'],
    ]);
  });

  it('copes with a period without generation or peak', () => {
    const night: EnergySummary = {
      totals: totals({ consumedKwh: 1 }),
      flows: {
        ...flows,
        solarToHomeKwh: 0,
        solarToStorageKwh: 0,
        solarToGridKwh: 0,
      },
    };
    const kpis = toKpis(night, undefined, DUBAI);
    expect(kpis.find((k) => k.label === 'Self-consumption')).toMatchObject({
      value: '—',
      trend: 'No solar generated',
    });
    expect(kpis.find((k) => k.label === 'Peak demand')).toMatchObject({
      value: '—',
      trend: 'No readings',
    });
    expect(kpis.find((k) => k.label === 'Solar generation')?.trend).toBe('');
  });

  it('splits each source by where its energy went', () => {
    const balance = toEnergyBalance(summary);
    expect(balance.summary.map((s) => [s.label, s.value])).toEqual([
      ['Generated', '28.4 kWh'],
      ['Consumed', '36.0 kWh'],
      ['Self-use', '90.1%'],
    ]);
    const solar = balance.sources[0];
    expect(solar).toMatchObject({
      label: 'Solar',
      total: '28.4 kWh',
      segmentWidths: [68, 23, 10],
    });
    expect(solar.splits).toEqual([
      { label: 'Home (direct)', value: '19.2 kWh' },
      { label: 'Battery charge', value: '6.4 kWh' },
      { label: 'Grid export', value: '2.8 kWh' },
    ]);
    expect(balance.sources.map((s) => s.label)).toEqual([
      'Solar',
      'Grid',
      'Battery',
    ]);
  });

  it('keeps segment widths at zero when a source produced nothing', () => {
    const empty = toEnergyBalance({
      totals: totals(),
      flows: {
        ...flows,
        solarToHomeKwh: 0,
        solarToStorageKwh: 0,
        solarToGridKwh: 0,
      },
    });
    expect(empty.sources[0].segmentWidths).toEqual([0, 0, 0]);
    expect(empty.summary[2].value).toBe('—');
  });

  it('averages consumption by weekday and hour in the local time zone', () => {
    const bucket = (startsAt: string, consumptionKw: number): EnergyBucket => ({
      startsAt,
      energy: totals(),
      averagePower: { solarKw: 0, consumptionKw, exportKw: 0, importKw: 0 },
    });
    // Sunday 2026-11-01 19:00 Dubai, twice a week apart; Monday 2026-11-02 00:00 Dubai.
    const matrix = toPeakMatrix(
      [
        bucket('2026-10-25T15:00:00Z', 2),
        bucket('2026-11-01T15:00:00Z', 4),
        bucket('2026-11-01T20:00:00Z', 1),
      ],
      DUBAI,
    );
    expect(matrix.days).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(matrix.cells).toContainEqual([19, 6, 3]);
    expect(matrix.cells).toContainEqual([0, 0, 1]);
    expect(matrix.cells).toHaveLength(2);
    expect(matrix.max).toBe(3);
  });

  it('exports the series as CSV', () => {
    const csv = seriesToCsv([
      {
        startsAt: '2026-11-01T20:00:00.000Z',
        energy: totals({
          generatedKwh: 1.23456,
          consumedKwh: 2,
          exportedKwh: 0.5,
          importedKwh: 0,
        }),
        averagePower: {
          solarKw: 0,
          consumptionKw: 0,
          exportKw: 0,
          importKw: 0,
        },
      },
    ]);
    expect(csv).toBe(
      'starts_at,generated_kwh,consumed_kwh,exported_kwh,imported_kwh\n2026-11-01T20:00:00.000Z,1.235,2.000,0.500,0.000\n',
    );
  });
});

describe('asset views', () => {
  it('builds real solar and storage assets with house-level status', () => {
    const assets = toAssetViews(house, reading, [], NOW);
    expect(
      assets.map((a) => [
        a.category,
        a.name,
        a.status,
        a.statValue,
        a.statLabel,
        a.socPercent,
        a.lastUpdated,
      ]),
    ).toEqual([
      [
        'Solar',
        'Rooftop Solar',
        'Online',
        '+3.8',
        'Generating',
        undefined,
        '2 min ago',
      ],
      [
        'Battery',
        'Home Battery',
        'Online',
        '+1.2',
        'Charging',
        94,
        '2 min ago',
      ],
      [
        'EV',
        'Electric Vehicle',
        'Online',
        '-3.0',
        'Discharging',
        67,
        '2 min ago',
      ],
    ]);
    expect(assets[0]).not.toHaveProperty('health');
    expect(assets[0]).not.toHaveProperty('controlMode');
  });

  it('marks every asset offline when the meter is offline', () => {
    const assets = toAssetViews(
      { ...house, meterStatus: 'offline' },
      reading,
      [],
      NOW,
    );
    expect(new Set(assets.map((a) => a.status))).toEqual(new Set(['Offline']));
  });
});

describe('toAccountStatus', () => {
  it('shows the trading mode and a reporting meter', () => {
    const status = toAccountStatus(house);
    expect(status.tradingMode.value).toBe('Prosumer');
    expect(status.smartMeter).toMatchObject({
      value: 'Connected',
      tone: 'success',
    });
  });

  it('warns when the meter is offline', () => {
    const status = toAccountStatus({ ...house, meterStatus: 'offline' });
    expect(status.smartMeter).toMatchObject({
      value: 'Offline',
      tone: 'warning',
    });
  });

  it('asks to link a meter when the user has no house', () => {
    const status = toAccountStatus(null);
    expect(status.smartMeter.value).toBe('Not linked');
    expect(status.tradingMode.tone).toBe('warning');
  });
});

describe('gridLabel', () => {
  it('uses the display name, falling back to the grid ID', () => {
    expect(gridLabel(house)).toBe('Grid 01');
    expect(
      gridLabel({ ...house, grid: { gridId: 'grid01', displayName: ' ' } }),
    ).toBe('grid01');
  });
});

describe('dashboard greeting', () => {
  // Dubai is UTC+4, so 05:00Z is 09:00 GST.
  const at = (utc: string) => new Date(`2026-11-12T${utc}:00Z`);

  it('changes with the time of day in GST', () => {
    expect(dashboardGreeting(at('05:00'), DUBAI)).toEqual({
      phrase: 'Good morning',
      emoji: '☀️',
    });
    expect(dashboardGreeting(at('10:00'), DUBAI).phrase).toBe('Good afternoon');
    expect(dashboardGreeting(at('15:00'), DUBAI).phrase).toBe('Good evening');
    expect(dashboardGreeting(at('19:00'), DUBAI).phrase).toBe('Quiet night');
    expect(dashboardGreeting(at('23:00'), DUBAI).phrase).toBe('Quiet night');
  });

  it('switches at the edges of each part of the day', () => {
    expect(dashboardGreeting(at('00:59'), DUBAI).phrase).toBe('Quiet night');
    expect(dashboardGreeting(at('01:00'), DUBAI).phrase).toBe('Good morning');
    expect(dashboardGreeting(at('08:00'), DUBAI).phrase).toBe('Good afternoon');
    expect(dashboardGreeting(at('13:00'), DUBAI).phrase).toBe('Good evening');
    expect(dashboardGreeting(at('17:00'), DUBAI).phrase).toBe('Quiet night');
  });
});
