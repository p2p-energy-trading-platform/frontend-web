import { useEffect, useState } from 'react'

import type { KycStatus } from '#/components/auth/KycStep'
import {
  countries,
  countryCodes,
  sessionUser,
  tradeValueCurrency,
} from '#/data/profile'
import type { PersonalProfile } from '#/data/profile'
import { getKycStatus } from '#/lib/kyc-status'
import { getSmartMeterStatus } from '#/lib/smart-meter-status'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'

export type { PersonalProfile }

export function useSession() {
  return {
    source: 'demo' as const,
    user: sessionUser,
  }
}

export function useProfile() {
  const [kycStatus, setKycStatus] = useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] = useState<SmartMeterStatus>('skipped')

  useEffect(() => {
    setKycStatus(getKycStatus())
    setMeterStatus(getSmartMeterStatus())
  }, [])

  return {
    source: 'demo' as const,
    user: sessionUser,
    kycStatus,
    meterStatus,
    countries,
    countryCodes,
    tradeValueCurrency,
  }
}
