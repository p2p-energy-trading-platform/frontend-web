import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Battery,
  BatteryCharging,
  Gauge,
  Percent,
  Sun,
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
    <div className="flex min-h-screen bg-bg-canvas">
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
          <div className="inline-flex w-fit rounded-lg border border-border-subtle bg-bg-elevated p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setTab('usage')}
              className={cn(
                'rounded-md px-4 py-1.5 transition',
                tab === 'usage'
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              Generation &amp; Usage
            </button>
            <button
              type="button"
              onClick={() => setTab('assets')}
              className={cn(
                'rounded-md px-4 py-1.5 transition',
                tab === 'assets'
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              Assets
            </button>
          </div>

          {tab === 'usage' ? (
            <GenerationUsageView />
          ) : (
            <div className="rounded-xl border border-dashed border-border-subtle p-10 text-center text-sm text-text-tertiary">
              Assets tab — send me that frame's Figma link and I'll build it
              the same way.
            </div>
          )}
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
            value: '28.4',
            unit: 'kWh',
            label: 'Solar generation',
            trend: '+2.1 vs forecast',
            trendClassName: 'text-brand-primary',
          },
          {
            icon: Zap,
            value: '36.0',
            unit: 'kWh',
            label: 'Household consumption',
            trend: '+2.8 vs avg',
            trendClassName: 'text-brand-warning',
          },
          {
            icon: Percent,
            value: '81.7',
            unit: '%',
            label: 'Self-consumption',
            trend: '+4 pts vs wk',
            trendClassName: 'text-brand-primary',
          },
          {
            icon: ArrowDownLeft,
            value: '9.4',
            unit: 'kWh',
            label: 'Grid import',
            trend: '-1.2 vs avg',
            trendClassName: 'text-brand-primary',
          },
          {
            icon: ArrowUpRight,
            value: '3.2',
            unit: 'kWh',
            label: 'Grid export',
            trend: 'AED 1.22 earned',
            trendClassName: 'text-brand-primary',
          },
          {
            icon: Gauge,
            value: '3.4',
            unit: 'kW',
            label: 'Peak demand',
            trend: '19:00–19:30 GST',
          },
          {
            icon: TrendingUp,
            value: '8.40',
            unit: 'AED',
            label: 'Est. savings',
            trend: 'vs retail tariff',
            trendClassName: 'text-brand-primary',
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
                colorClass: 'bg-brand-primary',
                strokeColor: 'var(--brand-primary)',
              },
              {
                label: 'Water Heater',
                valueKwh: 4.2,
                colorClass: 'bg-brand-info',
                strokeColor: 'var(--brand-info)',
              },
              {
                label: 'Appliances',
                valueKwh: 5.6,
                colorClass: 'bg-brand-warning',
                strokeColor: 'var(--brand-warning)',
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
                colorClass: 'bg-brand-primary/60',
                strokeColor: 'var(--brand-primary)',
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
              { icon: Sun, value: '28.4 kWh', label: 'Generated' },
              { icon: Zap, value: '36 kWh', label: 'Consumed' },
              { icon: Percent, value: '81.7%', label: 'Self-use' },
            ]}
            sources={[
              {
                icon: Sun,
                iconClassName: 'bg-brand-warning-muted text-brand-warning',
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
                iconClassName: 'bg-bg-elevated text-text-secondary',
                label: 'Grid',
                total: '9.4 kWh',
                segmentWidths: [100],
                splits: [{ label: 'Home (import)', value: '9.4 kWh' }],
              },
              {
                icon: BatteryCharging,
                iconClassName: 'bg-brand-primary-muted text-brand-primary',
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
                iconClassName: 'bg-brand-primary-muted text-brand-primary',
                title: 'Export window open',
                description:
                  'Peak export 10:30–13:30 — 2.4 kWh still available',
              },
              {
                icon: Zap,
                iconClassName: 'bg-brand-warning-muted text-brand-warning',
                title: 'AC usage 22% above average',
                description:
                  "Today's AC draw is 18.4 kWh vs your 7-day average",
              },
              {
                icon: Battery,
                iconClassName: 'bg-brand-info-muted text-brand-info',
                title: 'Battery will cover evening peak',
                description:
                  'At current rate, 9.2 kWh stored will cover 17:00–21:00',
              },
              {
                icon: TrendingUp,
                iconClassName: 'bg-brand-primary-muted text-brand-primary',
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