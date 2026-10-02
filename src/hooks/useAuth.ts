import {
  accountBenefits,
  kycCountries,
  registrationDelayMs,
  registrationSteps,
} from '#/data/auth'
import { saveKycStatus } from '#/lib/kyc-status'
import type { KycStatus } from '#/components/auth/KycStep'
import { saveSmartMeterStatus } from '#/lib/smart-meter-status'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useRegistration() {
  return {
    source: 'demo' as const,
    steps: registrationSteps,
    benefits: accountBenefits,
    submitAccount() {
      return wait(registrationDelayMs.account)
    },
    advanceStep() {
      return wait(registrationDelayMs.step)
    },
    async completeKyc(status: KycStatus) {
      await wait(registrationDelayMs.step)
      saveKycStatus(status)
    },
    async completeSmartMeter(status: SmartMeterStatus) {
      await wait(registrationDelayMs.step)
      saveSmartMeterStatus(status)
    },
  }
}

export function useKycOptions() {
  return {
    source: 'demo' as const,
    countries: kycCountries,
  }
}
