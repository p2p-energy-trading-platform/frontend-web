import {
  ArrowDownLeft,
  ArrowUpRight,
  Battery,
  BatteryCharging,
  Car,
  Droplets,
  Gauge,
  Percent,
  Sun,
  Thermometer,
  TrendingUp,
  Zap,
} from 'lucide-react'

import type { AssetCategory } from '#/components/energy-assets/AssetFilterBar'
import type { AssetCardProps } from '#/components/energy-assets/AssetCard'
import { CURRENCY_CODE, formatAed } from '#/data/currency'
import { sessionUser } from '#/data/profile'

export type EnergyAsset = AssetCardProps & {
  category: Exclude<AssetCategory, 'All assets'>
}

export const energyAssets: Array<EnergyAsset> = [
  {
    category: 'Solar',
    icon: Sun,
    iconWrapClassName: 'bg-chart-3/12 text-chart-3',
    name: 'Rooftop Solar Array',
    brandModel: 'JA Solar · JAM72S20 370/MR',
    status: 'Online',
    statValue: '+3.4',
    statValueClassName: 'text-chart-3',
    statUnit: 'kW',
    statLabel: 'Generating',
    health: 'Good',
    healthPercent: 82,
    lastUpdated: 'Just now',
    controlMode: 'Monitoring only',
  },
  {
    category: 'Battery',
    icon: BatteryCharging,
    iconWrapClassName: 'bg-accent/12 text-accent',
    name: 'Home Battery',
    brandModel: 'Tesla · Powerwall 2',
    status: 'Online',
    statValue: '+1.2',
    statValueClassName: 'text-accent',
    statUnit: 'kW',
    statLabel: 'Charging',
    socPercent: 67,
    health: 'Good',
    healthPercent: 82,
    lastUpdated: '1 min ago',
    controlMode: 'Controllable',
  },
  {
    category: 'EV',
    icon: Car,
    iconWrapClassName: 'bg-chart-4/12 text-chart-4',
    name: 'Tesla Model Y',
    brandModel: 'Tesla · Model Y Long',
    status: 'Idle',
    statValue: '0',
    statValueClassName: 'text-chart-4',
    statUnit: 'kW',
    statLabel: 'Active draw',
    socPercent: 67,
    health: 'Good',
    healthPercent: 72,
    lastUpdated: '8 min ago',
    controlMode: 'Controllable',
  },
  {
    category: 'Charger',
    icon: Zap,
    iconWrapClassName: 'bg-accent/12 text-accent',
    name: 'EV Charger',
    brandModel: 'Wallbox · Pulsar Plus 22',
    status: 'Idle',
    statValue: '0',
    statValueClassName: 'text-accent',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Good',
    healthPercent: 78,
    lastUpdated: '3 min ago',
    controlMode: 'Controllable',
  },
  {
    category: 'Flex loads',
    icon: Droplets,
    iconWrapClassName: 'bg-chart-4/12 text-chart-4',
    name: 'Water Heater',
    brandModel: 'Ariston · Lydos Hybrid 80L',
    status: 'Online',
    statValue: '+0.8',
    statValueClassName: 'text-chart-4',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Degraded',
    healthPercent: 65,
    lastUpdated: '5 min ago',
    controlMode: 'Controllable',
  },
  {
    category: 'Flex loads',
    icon: Thermometer,
    iconWrapClassName: 'bg-secondary text-text-secondary',
    name: 'HVAC — Main Zone',
    brandModel: 'Daikin · SkyAir RZQS100',
    status: 'Online',
    statValue: '+3.2',
    statValueClassName: 'text-text-primary',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Good',
    healthPercent: 66,
    lastUpdated: '2 min ago',
    controlMode: 'Monitoring only',
  },
]

export const energyPageMeta = {
  dateLabel: 'Thursday, 17 Jul 2025',
  locationLabel: `${sessionUser.property} · ${sessionUser.zone}`,
  meterLabel: `${sessionUser.property} · ${sessionUser.zone} · ${sessionUser.meterId}`,
}

export const energyKpis = [
  {
    icon: Sun,
    iconClassName: 'bg-chart-3/12 text-chart-3',
    value: '28.4',
    unit: 'kWh',
    label: 'Solar generation',
    trend: '+2.1 vs forecast',
    trendClassName: 'text-accent',
  },
  {
    icon: Zap,
    iconClassName: 'bg-chart-4/12 text-chart-4',
    value: '36.0',
    unit: 'kWh',
    label: 'Household consumption',
    trend: '+2.8 vs avg',
    trendClassName: 'text-chart-4',
  },
  {
    icon: Percent,
    iconClassName: 'bg-accent/12 text-accent',
    value: '81.7',
    unit: '%',
    label: 'Self-consumption',
    trend: '+4 pts vs wk',
    trendClassName: 'text-accent',
  },
  {
    icon: ArrowDownLeft,
    iconClassName: 'bg-chart-4/12 text-chart-4',
    value: '9.4',
    unit: 'kWh',
    label: 'Grid import',
    trend: '-1.2 vs avg',
    trendClassName: 'text-accent',
  },
  {
    icon: ArrowUpRight,
    iconClassName: 'bg-accent/12 text-accent',
    value: '3.2',
    unit: 'kWh',
    label: 'Grid export',
    trend: `${formatAed(1.22)} earned`,
    trendClassName: 'text-accent',
  },
  {
    icon: Gauge,
    iconClassName: 'bg-chart-3/12 text-chart-3',
    value: '3.4',
    unit: 'kW',
    label: 'Peak demand',
    trend: '19:00–19:30 GST',
  },
  {
    icon: TrendingUp,
    iconClassName: 'bg-accent/12 text-accent',
    value: '8.40',
    unit: CURRENCY_CODE,
    label: 'Est. savings',
    trend: 'vs retail tariff',
    trendClassName: 'text-accent',
  },
]

export const usageCategories = [
  {
    label: 'Air Conditioning',
    valueKwh: 18.4,
    colorClass: 'bg-chart-3',
    strokeColor: 'var(--chart-3)',
  },
  {
    label: 'Water Heater',
    valueKwh: 4.2,
    colorClass: 'bg-chart-4',
    strokeColor: 'var(--chart-4)',
  },
  {
    label: 'Appliances',
    valueKwh: 5.6,
    colorClass: 'bg-accent',
    strokeColor: 'var(--action-accent)',
  },
  {
    label: 'Lighting',
    valueKwh: 2.1,
    colorClass: 'bg-text-tertiary',
    strokeColor: 'var(--text-tertiary)',
  },
  {
    label: 'EV Charging',
    valueKwh: 3.8,
    colorClass: 'bg-accent/60',
    strokeColor: 'var(--action-accent)',
  },
  {
    label: 'Other',
    valueKwh: 1.9,
    colorClass: 'bg-border-subtle',
    strokeColor: 'var(--border-subtle)',
  },
]

export const energyBalance = {
  summary: [
    {
      icon: Sun,
      iconClassName: 'bg-chart-3/12 text-chart-3',
      value: '28.4 kWh',
      label: 'Generated',
    },
    {
      icon: Zap,
      iconClassName: 'bg-chart-4/12 text-chart-4',
      value: '36 kWh',
      label: 'Consumed',
    },
    {
      icon: Percent,
      iconClassName: 'bg-accent/12 text-accent',
      value: '81.7%',
      label: 'Self-use',
    },
  ],
  sources: [
    {
      icon: Sun,
      iconClassName: 'bg-chart-3/12 text-chart-3',
      label: 'Solar',
      total: '28.4 kWh',
      segmentWidths: [67, 22, 11],
      splits: [
        { label: 'Home (direct)', value: '19.2 kWh' },
        { label: 'Battery charge', value: '6.4 kWh' },
        { label: 'Grid export', value: '2.8 kWh' },
      ],
    },
    {
      icon: ArrowDownLeft,
      iconClassName: 'bg-secondary text-text-secondary',
      label: 'Grid',
      total: '9.4 kWh',
      segmentWidths: [100],
      splits: [{ label: 'Home (import)', value: '9.4 kWh' }],
    },
    {
      icon: BatteryCharging,
      iconClassName: 'bg-accent/12 text-accent',
      label: 'Battery',
      total: '7.8 kWh',
      segmentWidths: [100],
      splits: [{ label: 'Home (evening)', value: '7.8 kWh' }],
    },
  ],
  exportEarnings: formatAed(1.22, 2, 'always'),
}

export const energyInsights = [
  {
    icon: Sun,
    iconClassName: 'bg-accent/12 text-accent',
    title: 'Export window open',
    description: 'Peak export 10:30–13:30 — 2.4 kWh still available',
  },
  {
    icon: Zap,
    iconClassName: 'bg-chart-4/12 text-chart-4',
    title: 'AC usage 22% above average',
    description: "Today's AC draw is 18.4 kWh vs your 7-day average",
  },
  {
    icon: Battery,
    iconClassName: 'bg-chart-3/12 text-chart-3',
    title: 'Battery will cover evening peak',
    description: 'At current rate, 9.2 kWh stored will cover 17:00–21:00',
  },
  {
    icon: TrendingUp,
    iconClassName: 'bg-accent/12 text-accent',
    title: 'Self-consumption up 4% vs last week',
    description:
      '81.7% of your solar was used on-site, compared with 77.8% last week',
  },
]

export const generatedSeries = [
  0, 0, 0, 0.02, 0.08, 0.25, 0.5, 0.75, 0.92, 1, 0.96, 0.85, 0.65, 0.4, 0.18,
  0.05, 0, 0, 0, 0, 0, 0, 0, 0,
]

export const consumedSeries = [
  0.2, 0.18, 0.15, 0.15, 0.2, 0.3, 0.4, 0.45, 0.42, 0.4, 0.42, 0.5, 0.55, 0.5,
  0.45, 0.5, 0.6, 0.75, 0.9, 0.85, 0.6, 0.4, 0.3, 0.22,
]

export const energySeriesAxis = {
  yLabels: ['2 kW', '1.5 kW', '1 kW', '0.5 kW', '0 kW'],
  xLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  nowIndex: 12,
}

export const forecastSeries = [
  0.05, 0.15, 0.35, 0.55, 0.72, 0.85, 0.92, 0.88, 0.75, 0.55, 0.35, 0.15, 0.05,
]

export const forecastActual = [
  0.04, 0.13, 0.32, 0.5, 0.7, 0.82, 0.9, 0.85, 0.72, 0.5, 0.3, 0.12, 0.04,
]

export const forecastAxis = {
  xLabels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
  yLabels: ['4kW', '3kW', '2kW', '1kW', '0kW'],
  accuracyPercent: '96.8%',
}

export const peakDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const peakHourLabels = [
  '06',
  '08',
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '22',
]

export const peakMatrix = [
  [
    0.25, 0.3, 0.32, 0.38, 0.3, 0.37, 0.01, 0.19, 0.38, 0.26, 0.36, 0.73, 0.84,
    0.77, 0.22, 0.23, 0.01, 0.09,
  ],
  [
    0.11, 0.37, 0.31, 0.06, 0.32, 0.06, 0.25, 0.05, 0, 0.35, 0.08, 0.76, 0.99,
    0.96, 0.12, 0.38, 0.22, 0.27,
  ],
  [
    0.08, 0.38, 0.28, 0.39, 0.36, 0.12, 0.14, 0.07, 0.06, 0.03, 0.12, 0.88, 0.7,
    0.9, 0.14, 0.12, 0.33, 0.19,
  ],
  [
    0.13, 0.19, 0.28, 0.02, 0.39, 0.01, 0.3, 0.34, 0.01, 0.32, 0.15, 0.87, 0.7,
    0.71, 0.07, 0.38, 0.08, 0.3,
  ],
  [
    0.37, 0.38, 0.14, 0.14, 0.21, 0.31, 0.04, 0.3, 0.32, 0.34, 0.01, 0.98, 0.73,
    0.8, 0.24, 0.37, 0.14, 0.37,
  ],
  [
    0.22, 0.12, 0.13, 0.07, 0.03, 0.06, 0.28, 0.4, 0.06, 0.02, 0.39, 0.86, 0.82,
    0.77, 0.24, 0.33, 0.18, 0.17,
  ],
  [
    0.02, 0.37, 0.01, 0.2, 0.34, 0.05, 0.29, 0.38, 0.25, 0.32, 0.04, 0.83, 0.74,
    0.95, 0.12, 0.18, 0.4, 0.34,
  ],
]
