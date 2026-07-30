import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  ArrowUpRight,
  BatteryCharging,
  Bell,
  Car,
  CircleGauge,
  Home,
  Plus,
  Sun,
  Wallet,
  Zap,
} from 'lucide-react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { StatTile } from '#/components/dashboard/StatTile'
import { EnergyPositionCard } from '#/components/dashboard/EnergyPositionCard'
import { GenerationChart } from '#/components/dashboard/GenerstionChart'
import { DeviceCard } from '#/components/dashboard/DeviceCard'
import { QuickActionsCard } from '#/components/dashboard/QuickActionsCard'
import { CurrentSlotCard } from '#/components/dashboard/CurentSlotCard'
import { LiveEnergyFlowCard } from '#/components/dashboard/LiveEnergyFlowCard'
import { RecentActivityCard } from '#/components/dashboard/RecentActivityCard'
import { MarketCard } from '#/components/dashboard/MarketCard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const user = {
    name: 'Sara A.',
    role: 'Prosumer',
    initials: 'SA',
    property: 'Villa 47',
    zone: 'JLT Zone 4',
  }

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
          {/* Greeting row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-heading-2 text-text-primary">
                Good evening, Sara ☀️
              </h1>
              <p className="text-sm text-text-tertiary">
                Thursday, 17 Jul 2025 · 14:38 GST · JLT Zone 4
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-bg-elevated px-3.5 text-sm font-medium text-text-primary transition hover:bg-bg-overlay"
              >
                <Plus className="size-4" />
                Post listing
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-accent-foreground transition hover:brightness-95"
              >
                Buy energy
              </button>
            </div>
          </div>

          {/* Hero energy position */}
          <EnergyPositionCard
            netKwh={12.4}
            generatedKwh={42.6}
            consumedKwh={30.2}
            exportedKwh={8.4}
            importedKwh={0}
          />

          {/* Stat tile row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            <StatTile
              icon={Wallet}
              iconClassName="bg-brand-primary-muted text-brand-primary"
              value="AED 284.50"
              label="Wallet balance"
            />
            <StatTile
              icon={ArrowUpRight}
              iconClassName="bg-brand-primary-muted text-brand-primary"
              value="+AED 3.19"
              label="Trading P&L"
            />
            <StatTile
              icon={CircleGauge}
              iconClassName="bg-brand-info-muted text-brand-info"
              value="AED 1.60"
              label="Saved vs tariff"
            />
            <StatTile
              icon={Sun}
              iconClassName="bg-brand-warning-muted text-brand-warning"
              value="18.4 kg"
              label="Avoided carbon"
            />
            <StatTile
              icon={ArrowUpRight}
              iconClassName="bg-brand-primary-muted text-brand-primary"
              value="8.4 kWh"
              label="Sold today"
            />
            <StatTile
              icon={ArrowDownLeft}
              iconClassName="bg-brand-info-muted text-brand-info"
              value="0 kWh"
              label="Bought today"
            />
            <StatTile
              icon={BatteryCharging}
              iconClassName="bg-brand-primary-muted text-brand-primary"
              value="94%"
              label="Battery SoC"
            />
          </div>

          {/* Chart + right rail */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
            <GenerationChart />

            <div className="flex flex-col gap-5">
              <QuickActionsCard
                actions={[
                  {
                    label: 'Buy energy',
                    icon: ArrowDownLeft,
                    primary: true,
                  },
                  { label: 'Sell surplus', icon: ArrowUpRight },
                  { label: 'Deposit funds', icon: Wallet },
                  { label: 'Add asset', icon: Plus },
                ]}
              />

              <CurrentSlotCard
                timeRange="14:30 – 15:00"
                pricePerKwh="AED 0.38"
                remainingLabel="18:21"
                exportKw="3.2 kW"
                progressPercent={62}
              />
            </div>
          </div>

          {/* Devices + live flow / recent activity / market */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DeviceCard
                icon={Sun}
                iconWrapClassName="bg-brand-warning-muted text-brand-warning"
                title="Solar PV"
                subtitle="Rooftop · 6 kWp"
                statusLabel="Generating"
                value="3.8"
                valueLabel="kW"
                footnote="Auto-export"
              />
              <DeviceCard
                icon={BatteryCharging}
                iconWrapClassName="bg-brand-primary-muted text-brand-primary"
                title="Home Battery"
                subtitle="14 kWh · AC-coupled"
                statusLabel="Charging"
                value="1.2"
                valueLabel="kW"
                progressPercent={94}
                footnote="Peak-shift"
              />
              <DeviceCard
                icon={Car}
                iconWrapClassName="bg-brand-info-muted text-brand-info"
                title="EV"
                subtitle="Plugged in · V2G ready"
                statusLabel="Charging"
                value="11"
                valueLabel="kW"
                progressPercent={67}
                footnote="Smart charge"
              />
            </div>

            <LiveEnergyFlowCard
              tiles={[
                {
                  icon: Sun,
                  label: 'Solar PV',
                  value: '3.8 kW',
                  tone: 'warning',
                },
                { icon: Home, label: 'Home', value: '2.5 kW', tone: 'default' },
                {
                  icon: BatteryCharging,
                  label: 'Battery',
                  value: '1.2 kW ↑',
                  tone: 'primary',
                },
                {
                  icon: ArrowUpRight,
                  label: 'Grid export',
                  value: '0.1 kW',
                  tone: 'info',
                },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
            <RecentActivityCard
              items={[
                {
                  icon: ArrowUpRight,
                  iconClassName: 'bg-brand-primary-muted text-brand-primary',
                  title: 'Sold 8.4 kWh',
                  subtitle: 'to M. Al-Rashidi · JLT',
                  amount: '+AED 3.19',
                  amountClassName: 'text-brand-primary',
                  time: '14:32',
                },
                {
                  icon: Bell,
                  iconClassName: 'bg-brand-info-muted text-brand-info',
                  title: 'Price alert',
                  subtitle: 'Dubai South hit AED 0.38/kWh',
                  time: '13:50',
                },
                {
                  icon: ArrowDownLeft,
                  iconClassName: 'bg-bg-elevated text-text-secondary',
                  title: 'Bought 5.2 kWh',
                  subtitle: 'from F. Al-Mansouri · JLT',
                  amount: '-AED 2.13',
                  amountClassName: 'text-destructive',
                  time: '13:15',
                },
                {
                  icon: Zap,
                  iconClassName: 'bg-bg-elevated text-text-secondary',
                  title: 'Meter sync',
                  subtitle: 'SM-784-20241105 · 15-min read',
                  amount: '42.6 kWh',
                  time: '12:00',
                },
                {
                  icon: Wallet,
                  iconClassName: 'bg-brand-primary-muted text-brand-primary',
                  title: 'Funds deposited',
                  subtitle: 'Bank transfer confirmed',
                  amount: '+AED 100',
                  amountClassName: 'text-brand-primary',
                  time: '09:18',
                },
              ]}
            />

            <MarketCard
              listingCount={4}
              bestBuyPrice="AED 0.34"
              sellFloorPrice="AED 0.38"
              demandZone="Zone 4"
              traderCount={8}
              traders={[
                {
                  name: 'M. Al-Rashidi',
                  detail: '8.4 kWh · Solar',
                  price: '0.34',
                },
                {
                  name: 'F. Al-Mansouri',
                  detail: '12 kWh · Solar',
                  price: '0.36',
                },
                {
                  name: 'K. Al-Marri',
                  detail: '5.6 kWh · Battery',
                  price: '0.38',
                },
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
