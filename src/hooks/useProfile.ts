import { useEffect, useState } from 'react'

import type { KycStatus } from '#/components/auth/KycStep'
import {
  PROFILE_STORAGE_KEY,
  TRADING_PREFERENCES_STORAGE_KEY,
  countries,
  countryCodes,
  defaultProfile,
  defaultTradingPreferences,
  profileIntegrations,
  sessionUser,
  tradeValueCurrency,
} from '#/data/profile'
import type { PersonalProfile, TradingPreferences } from '#/data/profile'
import { getKycStatus } from '#/lib/kyc-status'
import { getSmartMeterStatus } from '#/lib/smart-meter-status'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'

export type { PersonalProfile, TradingPreferences }

function readStored<T extends object>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const saved = window.localStorage.getItem(key)
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback
  } catch {
    return fallback
  }
}

export function useSession() {
  return {
    source: 'demo' as const,
    user: sessionUser,
  }
}

export function useProfile() {
  const [kycStatus, setKycStatus] = useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] = useState<SmartMeterStatus>('skipped')
  const [profile, setProfile] = useState<PersonalProfile>(() =>
    readStored(PROFILE_STORAGE_KEY, defaultProfile),
  )
  const [tradingPreferences, setTradingPreferences] =
    useState<TradingPreferences>(() =>
      readStored(TRADING_PREFERENCES_STORAGE_KEY, defaultTradingPreferences),
    )

  useEffect(() => {
    setKycStatus(getKycStatus())
    setMeterStatus(getSmartMeterStatus())
  }, [])

  function saveProfile() {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }

  function saveTradingPreferences() {
    window.localStorage.setItem(
      TRADING_PREFERENCES_STORAGE_KEY,
      JSON.stringify(tradingPreferences),
    )
  }

  return {
    source: 'demo' as const,
    user: sessionUser,
    profile,
    setProfile,
    tradingPreferences,
    setTradingPreferences,
    kycStatus,
    meterStatus,
    countries,
    countryCodes,
    integrations: profileIntegrations,
    tradeValueCurrency,
    saveProfile,
    saveTradingPreferences,
  }
}
