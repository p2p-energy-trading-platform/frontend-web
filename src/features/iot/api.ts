import { apiRequest } from '#/lib/api-client';

export type DeviceClass = 'consumer' | 'residential_prosumer' | 'commercial';
export type AssetType = 'bess' | 'ev';
export type EnergyBucketSize = '5m' | '15m' | '30m' | '1h' | '1d';

export interface House {
  houseId: string;
  grid: { gridId: string; displayName: string };
  meterId: string;
  deviceClass: DeviceClass;
  ratedSolarKw?: number;
  meterStatus: 'online' | 'offline';
  lastHeartbeatAt?: string;
}

export interface FlexibleAsset {
  assetId: string;
  assetType: AssetType;
  capacityKwh: number;
  maxChargeKw: number;
  maxDischargeKw: number;
  v2gCapable?: boolean;
}

export interface StorageAssetReading {
  assetId: string;
  assetType: AssetType;
  socPct: number;
  /** Positive while charging, negative while discharging. */
  powerKw: number;
  capacityKwh: number;
  pluggedIn?: boolean;
}

export interface MeterReading {
  meterId: string;
  measuredAt: string;
  seq: number;
  solarKw: number;
  consumptionKw: number;
  /** Positive while exporting to the grid, negative while importing. */
  netKw: number;
  storageAssets: Array<StorageAssetReading>;
}

export interface EnergyTotals {
  generatedKwh: number;
  consumedKwh: number;
  exportedKwh: number;
  importedKwh: number;
  storageChargedKwh: number;
  storageDischargedKwh: number;
}

export interface EnergyFlows {
  solarToHomeKwh: number;
  solarToStorageKwh: number;
  solarToGridKwh: number;
  gridToHomeKwh: number;
  gridToStorageKwh: number;
  storageToHomeKwh: number;
  storageToGridKwh: number;
}

export interface EnergyBucket {
  startsAt: string;
  energy: EnergyTotals;
  averagePower: {
    solarKw: number;
    consumptionKw: number;
    exportKw: number;
    importKw: number;
  };
}

export interface EnergySummary {
  totals: EnergyTotals;
  flows: EnergyFlows;
  selfConsumptionPct?: number;
  peakDemand?: { consumptionKw: number; occurredAt: string };
}

export interface EnergyRange {
  from: string;
  to: string;
}

export interface EnergySeriesRange extends EnergyRange {
  bucket: EnergyBucketSize;
  timeZone: string;
}

function housePath(houseId: string, suffix = '') {
  return `/api/v1/iot/houses/${encodeURIComponent(houseId)}${suffix}`;
}

export function listHouses() {
  return apiRequest<{ houses: Array<House> }>('/api/v1/iot/houses');
}

export function getHouse(houseId: string) {
  return apiRequest<{ house: House; flexibleAssets: Array<FlexibleAsset> }>(
    housePath(houseId),
  );
}

export function getLatestReading(houseId: string) {
  return apiRequest<MeterReading>(housePath(houseId, '/latest-reading'));
}

export function getEnergySeries(houseId: string, range: EnergySeriesRange) {
  const query = new URLSearchParams({ ...range });
  return apiRequest<{ buckets: Array<EnergyBucket> }>(
    housePath(houseId, `/energy-series?${query}`),
  );
}

export function getEnergySummary(houseId: string, range: EnergyRange) {
  const query = new URLSearchParams({ from: range.from, to: range.to });
  return apiRequest<EnergySummary>(
    housePath(houseId, `/energy-summary?${query}`),
  );
}
