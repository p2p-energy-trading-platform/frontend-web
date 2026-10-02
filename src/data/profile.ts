import { CURRENCY_CODE } from '#/data/currency'

export const PROFILE_STORAGE_KEY = 'gridx-personal-profile'
export const TRADING_PREFERENCES_STORAGE_KEY = 'gridx-trading-preferences'

export const sessionUser = {
  name: 'Sara A.',
  givenName: 'Sara',
  fullName: 'Sara Al-Nuaimi',
  role: 'Prosumer' as const,
  initials: 'SA',
  property: 'Villa 47',
  zone: 'JLT Zone 4',
  meterId: 'SM-784-20241105',
  notificationCount: 3,
}

export type PersonalProfile = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  country: string
}

export type TradingPreferences = {
  orderType: string
  priceMode: string
  energyLimit: string
  tradeValue: string
  recommendPrice: boolean
  dispatchAutomation: boolean
}

export const defaultProfile: PersonalProfile = {
  fullName: sessionUser.fullName,
  email: 'sara.alnuaimi@example.ae',
  countryCode: '+971',
  phone: '50 123 4567',
  country: 'United Arab Emirates',
}

export const defaultTradingPreferences: TradingPreferences = {
  orderType: 'limit',
  priceMode: 'recommended',
  energyLimit: '450',
  tradeValue: '1000',
  recommendPrice: true,
  dispatchAutomation: false,
}

export const countryCodes = [
  { value: '+971', label: 'UAE (+971)' },
  { value: '+60', label: 'Malaysia (+60)' },
  { value: '+94', label: 'Sri Lanka (+94)' },
  { value: '+65', label: 'Singapore (+65)' },
]

export const countries = [
  'United Arab Emirates',
  'Malaysia',
  'Sri Lanka',
  'Singapore',
]

export const profileIntegrations = [
  {
    name: 'Utility Smart Meter API',
    description: 'Connection request not approved yet',
    status: 'Pending approval',
    action: 'Retry request',
    tone: 'warning' as const,
  },
  {
    name: 'Email delivery',
    description: 'Account and trading notifications enabled',
    status: 'Connected',
    action: 'Manage',
    tone: 'success' as const,
  },
  {
    name: 'Payment rail',
    description: 'Connect a payment provider for settlements',
    status: 'Not connected',
    action: 'Connect',
    tone: 'neutral' as const,
  },
]

export const tradeValueCurrency = CURRENCY_CODE
