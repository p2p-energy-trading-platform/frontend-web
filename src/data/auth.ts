import {
  BarChart3,
  BatteryCharging,
  Gauge,
  House,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Sun,
  WalletCards,
  Zap,
} from 'lucide-react';

export const registrationSteps = [
  { id: 1, label: 'Account', description: 'Email & password' },
  { id: 2, label: 'Verify email', description: 'One-time code' },
  { id: 3, label: 'Identity', description: 'KYC verification' },
  { id: 4, label: 'Smart Meter', description: 'Optional connection' },
];

export const accountBenefits = [
  { icon: Zap, text: 'Trade energy across 16 Dubai grid zones' },
  { icon: WalletCards, text: 'AED wallet with instant settlement' },
  { icon: ShieldCheck, text: 'Verified prosumer network you can trust' },
  { icon: Leaf, text: 'Measurable sustainability impact' },
  { icon: BarChart3, text: 'Real-time pricing and trade analytics' },
];

export const kycCountries = [
  'United Arab Emirates',
  'Bahrain',
  'Kuwait',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'Sri Lanka',
  'United Kingdom',
  'United States',
];

export const signInBenefits = [
  { icon: Gauge, label: '24/7 live energy marketplace' },
  { icon: ShieldCheck, label: 'Bank-grade encrypted sessions' },
  { icon: RefreshCw, label: 'Instant portfolio sync' },
];

export const signInNetworkNodes = [
  {
    label: 'Solar PV',
    sublabel: 'JLT Zone 4',
    icon: Sun,
    className: 'left-[8%] top-[12%]',
  },
  {
    label: 'Battery',
    sublabel: 'DIFC',
    icon: BatteryCharging,
    className: 'left-1/2 top-[2%] -translate-x-1/2',
  },
  {
    label: 'EV Export',
    sublabel: 'Downtown',
    icon: Zap,
    className: 'right-[8%] top-[12%]',
  },
  {
    label: 'Villa',
    sublabel: 'Al Quoz',
    icon: House,
    className: 'left-[8%] bottom-[4%]',
  },
  {
    label: 'Apartment',
    sublabel: 'Business Bay',
    icon: House,
    className: 'left-1/2 bottom-[-2%] -translate-x-1/2',
  },
  {
    label: 'Townhouse',
    sublabel: 'JBR',
    icon: House,
    className: 'right-[8%] bottom-[4%]',
  },
];

export const signInTestimonial = {
  quote:
    'Sold 18 kWh this month to neighbours — earned more than my electricity bill.',
  name: 'Sara A.',
  initials: 'SA',
  detail: 'Solar prosumer · JLT Zone 4',
};

export const registrationDelayMs = {
  account: 700,
  step: 600,
};
