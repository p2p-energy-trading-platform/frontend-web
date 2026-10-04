import { CURRENCY_CODE } from '#/data/currency';

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
};

export type PersonalProfile = {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  country: string;
};

export const defaultProfile: PersonalProfile = {
  fullName: sessionUser.fullName,
  email: 'sara.alnuaimi@example.ae',
  countryCode: '+971',
  phone: '50 123 4567',
  country: 'United Arab Emirates',
};

export const countryCodes = [
  { value: '+971', label: 'UAE (+971)' },
  { value: '+60', label: 'Malaysia (+60)' },
  { value: '+94', label: 'Sri Lanka (+94)' },
  { value: '+65', label: 'Singapore (+65)' },
];

export const countries = [
  'United Arab Emirates',
  'Malaysia',
  'Sri Lanka',
  'Singapore',
];

export const tradeValueCurrency = CURRENCY_CODE;
