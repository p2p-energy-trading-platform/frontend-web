import type { KycStatus } from '#/components/auth/KycStep'

export const KYC_STATUS_STORAGE_KEY = 'gridx:kyc-status'

export function saveKycStatus(status: KycStatus) {
  window.localStorage.setItem(KYC_STATUS_STORAGE_KEY, status)
}

export function getKycStatus(): KycStatus {
  const status = window.localStorage.getItem(KYC_STATUS_STORAGE_KEY)

  return status === 'pending' ? 'pending' : 'not-submitted'
}
