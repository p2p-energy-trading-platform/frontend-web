import { kycCountries, registrationDelayMs } from '#/data/auth'

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useRegistration() {
  return {
    source: 'demo' as const,
    submitAccount() {
      return wait(registrationDelayMs.account)
    },
    advanceStep() {
      return wait(registrationDelayMs.step)
    },
    async completeKyc() {
      await wait(registrationDelayMs.step)
    },
    async completeSmartMeter() {
      await wait(registrationDelayMs.step)
    },
  }
}

export function useKycOptions() {
  return {
    source: 'demo' as const,
    countries: kycCountries,
  }
}
