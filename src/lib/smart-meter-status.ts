export type SmartMeterStatus = 'pending' | 'skipped'

export const SMART_METER_STATUS_STORAGE_KEY = 'gridx:smart-meter-status'

export function saveSmartMeterStatus(status: SmartMeterStatus) {
  window.localStorage.setItem(SMART_METER_STATUS_STORAGE_KEY, status)
}

export function getSmartMeterStatus(): SmartMeterStatus {
  const status = window.localStorage.getItem(SMART_METER_STATUS_STORAGE_KEY)

  return status === 'pending' ? 'pending' : 'skipped'
}
