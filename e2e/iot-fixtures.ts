import type { MockApi } from './fixtures';

export const HOUSE_ID = 'grid01-house0003';
const HOUSE_PATH = `/api/v1/iot/houses/${HOUSE_ID}`;

export const testHouse = {
  houseId: HOUSE_ID,
  grid: { gridId: 'grid01', displayName: 'Grid 01' },
  meterId: 'meter-grid01-house0003',
  deviceClass: 'residential_prosumer',
  ratedSolarKw: 6,
  meterStatus: 'online',
  lastHeartbeatAt: new Date().toISOString(),
};

const totals = {
  generatedKwh: 24.6,
  consumedKwh: 18.2,
  exportedKwh: 9.1,
  importedKwh: 2.7,
  storageChargedKwh: 3.4,
  storageDischargedKwh: 2.4,
};

function bucket(startsAt: Date) {
  const hour = startsAt.getUTCHours();
  const solarKw = Math.max(0, 5 - Math.abs(hour - 8) * 0.8);
  return {
    startsAt: startsAt.toISOString(),
    energy: {
      generatedKwh: solarKw,
      consumedKwh: 1.2,
      exportedKwh: Math.max(0, solarKw - 1.2),
      importedKwh: solarKw ? 0 : 1.2,
      storageChargedKwh: 0,
      storageDischargedKwh: 0,
    },
    averagePower: {
      solarKw,
      consumptionKw: 1.2,
      exportKw: Math.max(0, solarKw - 1.2),
      importKw: solarKw ? 0 : 1.2,
    },
  };
}

/** Hourly buckets covering the requested range, capped at four weeks. */
function series(url: URL) {
  const from = new Date(url.searchParams.get('from') ?? Date.now());
  const to = new Date(url.searchParams.get('to') ?? Date.now());
  const buckets = [];
  for (
    let at = from.getTime();
    at < to.getTime() && buckets.length < 24 * 28;
    at += 3_600_000
  ) {
    buckets.push(bucket(new Date(at)));
  }
  return { buckets };
}

/** Mocks the IoT endpoints for one owned house with live readings. */
export function mockIot(api: MockApi, houses = [testHouse]): void {
  api.on('GET', '/api/v1/iot/houses', { body: { houses } });
  api.on('GET', HOUSE_PATH, {
    body: {
      house: testHouse,
      flexibleAssets: [
        {
          assetId: 'bess-1',
          assetType: 'bess',
          capacityKwh: 10,
          maxChargeKw: 5,
          maxDischargeKw: 5,
        },
        {
          assetId: 'ev-1',
          assetType: 'ev',
          capacityKwh: 60,
          maxChargeKw: 7.4,
          maxDischargeKw: 0,
        },
      ],
    },
  });
  api.on('GET', `${HOUSE_PATH}/latest-reading`, {
    body: {
      meterId: testHouse.meterId,
      measuredAt: new Date().toISOString(),
      seq: 42,
      solarKw: 4.2,
      consumptionKw: 1.6,
      netKw: 2.1,
      storageAssets: [
        {
          assetId: 'bess-1',
          assetType: 'bess',
          socPct: 72,
          powerKw: 0.5,
          capacityKwh: 10,
        },
      ],
    },
  });
  api.on('GET', `${HOUSE_PATH}/energy-series`, (route) => ({
    body: series(new URL(route.request().url())),
  }));
  api.on('GET', `${HOUSE_PATH}/energy-summary`, {
    body: {
      totals,
      flows: {
        solarToHomeKwh: 12.1,
        solarToStorageKwh: 3.4,
        solarToGridKwh: 9.1,
        gridToHomeKwh: 2.7,
        gridToStorageKwh: 0,
        storageToHomeKwh: 2.4,
        storageToGridKwh: 0,
      },
      selfConsumptionPct: 63,
      peakDemand: {
        consumptionKw: 3.8,
        occurredAt: new Date().toISOString(),
      },
    },
  });
}
