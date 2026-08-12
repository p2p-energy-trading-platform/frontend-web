import { createFileRoute } from '@tanstack/react-router'
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
import { useState } from 'react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { cn } from '#/lib/utils'

import { EnergyDateBar } from '#/components/energy-assets/EnergyStatbar'
import { EnergyKpiStrip } from '#/components/energy-assets/Energykpistrip'
import { EnergyTimeSeriesChart } from '#/components/energy-assets/Energyt-serieschart'
import { ForecastCard } from '#/components/energy-assets/Forecastcard'
import { UsageCategoryCard } from '#/components/energy-assets/Usagecategorycard'
import { PeakPeriodsCard } from '#/components/energy-assets/Peakperiodcard'
import { EnergyBalanceCard } from '#/components/energy-assets/Energybalancecard'
import { InsightsPanel } from '#/components/energy-assets/Insightspanel'
import { AssetFilterBar } from '#/components/energy-assets/Assetfilterbar'
import type { AssetCategory } from '#/components/energy-assets/Assetfilterbar'
import type { AssetSort } from '#/components/energy-assets/Assetfilterbar'
import { AssetCard } from '#/components/energy-assets/Assetcard'
import type { AssetCardProps } from '#/components/energy-assets/Assetcard'

const ASSETS: Array<
  AssetCardProps & { category: Exclude<AssetCategory, 'All assets'> }
> = [
  {
    category: 'Solar' as const,
    icon: Sun,
    iconWrapClassName: 'bg-chart-3/12 text-chart-3',
    name: 'Rooftop Solar Array',
    brandModel: 'JA Solar · JAM72S20 370/MR',
    status: 'Online' as const,
    statValue: '+3.4',
    statValueClassName: 'text-chart-3',
    statUnit: 'kW',
    statLabel: 'Generating',
    health: 'Good' as const,
    healthPercent: 82,
    lastUpdated: 'Just now',
    controlMode: 'Monitoring only' as const,
  },
  {
    category: 'Battery' as const,
    icon: BatteryCharging,
    iconWrapClassName: 'bg-accent/12 text-accent',
    name: 'Home Battery',
    brandModel: 'Tesla · Powerwall 2',
    status: 'Online' as const,
    statValue: '+1.2',
    statValueClassName: 'text-accent',
    statUnit: 'kW',
    statLabel: 'Charging',
    socPercent: 67,
    health: 'Good' as const,
    healthPercent: 82,
    lastUpdated: '1 min ago',
    controlMode: 'Controllable' as const,
  },
  {
    category: 'EV' as const,
    icon: Car,
    iconWrapClassName: 'bg-chart-4/12 text-chart-4',
    name: 'Tesla Model Y',
    brandModel: 'Tesla · Model Y Long',
    status: 'Idle' as const,
    statValue: '0',
    statValueClassName: 'text-chart-4',
    statUnit: 'kW',
    statLabel: 'Active draw',
    socPercent: 67,
    health: 'Good' as const,
    healthPercent: 72,
    lastUpdated: '8 min ago',
    controlMode: 'Controllable' as const,
  },
  {
    category: 'Charger' as const,
    icon: Zap,
    iconWrapClassName: 'bg-accent/12 text-accent',
    name: 'EV Charger',
    brandModel: 'Wallbox · Pulsar Plus 22',
    status: 'Idle' as const,
    statValue: '0',
    statValueClassName: 'text-accent',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Good' as const,
    healthPercent: 78,
    lastUpdated: '3 min ago',
    controlMode: 'Controllable' as const,
  },
  {
    category: 'Flex loads' as const,
    icon: Droplets,
    iconWrapClassName: 'bg-chart-4/12 text-chart-4',
    name: 'Water Heater',
    brandModel: 'Ariston · Lydos Hybrid 80L',
    status: 'Online' as const,
    statValue: '+0.8',
    statValueClassName: 'text-chart-4',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Degraded' as const,
    healthPercent: 65,
    lastUpdated: '5 min ago',
    controlMode: 'Controllable' as const,
  },
  {
    category: 'Flex loads' as const,
    icon: Thermometer,
    iconWrapClassName: 'bg-secondary text-text-secondary',
    name: 'HVAC — Main Zone',
    brandModel: 'Daikin · SkyAir RZQS100',
    status: 'Online' as const,
    statValue: '+3.2',
    statValueClassName: 'text-text-primary',
    statUnit: 'kW',
    statLabel: 'Active draw',
    health: 'Good' as const,
    healthPercent: 66,
    lastUpdated: '2 min ago',
    controlMode: 'Monitoring only' as const,
  },
]

export const Route = createFileRoute('/energyassets')({
  component: EnergyPage,
})

function EnergyPage() {
  const user = {
    name: 'Sara A.',
    role: 'Prosumer',
    initials: 'SA',
    property: 'Villa 47',
    zone: 'JLT Zone 4',
  }

  const [tab, setTab] = useState<'usage' | 'assets'>('usage')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          propertyName="Villa 47"
          zoneLabel="JLT Zone 4"
          meterOnline
          notificationCount={3}
          user={user}
        />

        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-6">
          {/* Page title */}
          <div>
            <h1 className="text-heading-2 text-text-primary">Energy</h1>
            <p className="text-sm text-text-tertiary">
              Villa 47 · JLT Zone 4 · SM-784-20241105
            </p>
          </div>

          {/* Generation & Usage / Assets tab toggle */}
          <div
            role="tablist"
            aria-label="Energy views"
            className="inline-flex w-fit rounded-lg border border-border-subtle bg-secondary p-1 text-sm font-medium"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'usage'}
              onClick={() => setTab('usage')}
              className={cn(
                'rounded-md px-4 py-1.5 transition',
                tab === 'usage'
                  ? 'bg-card text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              Generation &amp; Usage
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'assets'}
              onClick={() => setTab('assets')}
              className={cn(
                'rounded-md px-4 py-1.5 transition',
                tab === 'assets'
                  ? 'bg-card text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              Assets
            </button>
          </div>

          {tab === 'usage' ? <GenerationUsageView /> : <AssetsView />}
        </main>
      </div>
    </div>
  )
}

function GenerationUsageView() {
  const [period, setPeriod] = useState<'Day' | 'Week' | 'Month' | 'Custom'>(
    'Day',
  )

  return (
    <div className="flex flex-col gap-5">
      <EnergyDateBar
        period={period}
        onPeriodChange={setPeriod}
        dateLabel="Thursday, 17 Jul 2025"
        zoneLabel="Villa 47 · JLT Zone 4"
      />

      <EnergyKpiStrip
        kpis={[
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
            trend: 'AED 1.22 earned',
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
            unit: 'AED',
            label: 'Est. savings',
            trend: 'vs retail tariff',
            trendClassName: 'text-accent',
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_347px]">
        <div className="flex flex-col gap-5">
          <EnergyTimeSeriesChart />
          <ForecastCard accuracyPercent="96.8%" />
          <UsageCategoryCard
            categories={[
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
            ]}
          />
          <PeakPeriodsCard />
        </div>

        <div className="flex flex-col gap-5">
          <EnergyBalanceCard
            summary={[
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
            ]}
            sources={[
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
            ]}
            exportEarnings="+AED 1.22"
          />

          <InsightsPanel
            newCount={4}
            insights={[
              {
                icon: Sun,
                iconClassName: 'bg-accent/12 text-accent',
                title: 'Export window open',
                description:
                  'Peak export 10:30–13:30 — 2.4 kWh still available',
              },
              {
                icon: Zap,
                iconClassName: 'bg-chart-4/12 text-chart-4',
                title: 'AC usage 22% above average',
                description:
                  "Today's AC draw is 18.4 kWh vs your 7-day average",
              },
              {
                icon: Battery,
                iconClassName: 'bg-chart-3/12 text-chart-3',
                title: 'Battery will cover evening peak',
                description:
                  'At current rate, 9.2 kWh stored will cover 17:00–21:00',
              },
              {
                icon: TrendingUp,
                iconClassName: 'bg-accent/12 text-accent',
                title: 'Self-consumption up 4% vs last week',
                description:
                  '81.7% of your solar was used on-site, compared with 77.8% last week',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function AssetsView() {
  const [subTab, setSubTab] = useState<'devices' | 'automation'>('devices')
  const [category, setCategory] = useState<AssetCategory>('All assets')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<AssetSort>('name')
  const visibleAssets = [...ASSETS]
    .filter((asset) => category === 'All assets' || asset.category === category)
    .sort((first, second) => {
      if (sort === 'output') {
        return (
          Math.abs(Number(second.statValue)) - Math.abs(Number(first.statValue))
        )
      }
      if (sort === 'status') return first.status.localeCompare(second.status)
      return first.name.localeCompare(second.name)
    })

  return (
    <div className="flex flex-col gap-4">
      {/* Devices / Automation sub-toggle */}
      <div
        role="tablist"
        aria-label="Asset views"
        className="inline-flex w-fit rounded-2xl bg-secondary p-1 text-sm font-semibold"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'devices'}
          onClick={() => setSubTab('devices')}
          className={cn(
            'rounded-xl px-4 py-2 transition',
            subTab === 'devices'
              ? 'bg-card text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary',
          )}
        >
          Devices
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'automation'}
          onClick={() => setSubTab('automation')}
          className={cn(
            'rounded-xl px-4 py-2 transition',
            subTab === 'automation'
              ? 'bg-card text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary',
          )}
        >
          Automation
        </button>
      </div>

      {subTab === 'devices' ? (
        <>
          <AssetFilterBar
            category={category}
            onCategoryChange={setCategory}
            deviceCount={visibleAssets.length}
            view={view}
            onViewChange={setView}
            sort={sort}
            onSortChange={setSort}
          />

          <div
            className={cn(
              'grid gap-3',
              view === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1',
            )}
          >
            {visibleAssets.map(({ category: _category, ...asset }) => (
              <AssetCard key={asset.name} {...asset} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border-subtle bg-card p-10 text-center">
          <p className="text-sm font-medium text-text-primary">
            No automations configured
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            Create rules to coordinate your battery, EV charger, and flexible
            loads.
          </p>
        </div>
      )}
    </div>
  )
}
