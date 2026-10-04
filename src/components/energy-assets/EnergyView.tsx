import { useState } from 'react'

import { cn } from 'cn'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { EnergyDateBar } from '#/components/energy-assets/EnergyStatBar'
import { EnergyKpiStrip } from '#/components/energy-assets/EnergyKPIStrip'
import { EnergyTimeSeriesChart } from '#/components/energy-assets/EnergySeriesChart'
import { ForecastCard } from '#/components/energy-assets/ForecastCard'
import { UsageCategoryCard } from '#/components/energy-assets/UsageCategoryCard'
import { PeakPeriodsCard } from '#/components/energy-assets/PeakPeriodCard'
import { EnergyBalanceCard } from '#/components/energy-assets/EnergyBalanceCard'
import { InsightsPanel } from '#/components/energy-assets/InsightsPanel'
import { AssetFilterBar } from '#/components/energy-assets/AssetFilterBar'
import type {
  AssetCategory,
  AssetSort,
} from '#/components/energy-assets/AssetFilterBar'
import { AssetCard } from '#/components/energy-assets/AssetCard'
import { useEnergyAssets } from '#/hooks/useEnergyAssets'

export default function EnergyView() {
  const energy = useEnergyAssets()
  const [tab, setTab] = useState<'usage' | 'assets'>('usage')

  return (
    <main
      className="mx-auto flex w-full max-w-360 flex-col gap-5 p-6"
      data-source={energy.source}
    >
      <div>
        <h1 className="text-heading-2 text-text-primary">Energy</h1>
        <p className="text-sm text-text-tertiary">{energy.meta.meterLabel}</p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (value === 'usage' || value === 'assets') setTab(value)
        }}
      >
        <TabsList aria-label="Energy views">
          <TabsTrigger value="usage">Generation &amp; Usage</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'usage' ? <GenerationUsageView /> : <AssetsView />}
    </main>
  )
}

function GenerationUsageView() {
  const energy = useEnergyAssets()
  const [period, setPeriod] = useState<'Day' | 'Week' | 'Month' | 'Custom'>(
    'Day',
  )

  return (
    <div className="flex flex-col gap-5">
      <EnergyDateBar
        period={period}
        onPeriodChange={setPeriod}
        dateLabel={energy.meta.dateLabel}
        zoneLabel={energy.meta.locationLabel}
      />

      <EnergyKpiStrip kpis={energy.kpis} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_347px]">
        <div className="flex flex-col gap-5">
          <EnergyTimeSeriesChart />
          <ForecastCard />
          <UsageCategoryCard categories={energy.categories} />
          <PeakPeriodsCard />
        </div>

        <div className="flex flex-col gap-5">
          <EnergyBalanceCard
            summary={energy.balance.summary}
            sources={energy.balance.sources}
            exportEarnings={energy.balance.exportEarnings}
          />
          <InsightsPanel newCount={4} insights={energy.insights} />
        </div>
      </div>
    </div>
  )
}

function AssetsView() {
  const energy = useEnergyAssets()
  const [subTab, setSubTab] = useState<'devices' | 'automation'>('devices')
  const [category, setCategory] = useState<AssetCategory>('All assets')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<AssetSort>('name')
  const visibleAssets = [...energy.assets]
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
      <Tabs
        value={subTab}
        onValueChange={(value) => {
          if (value === 'devices' || value === 'automation') setSubTab(value)
        }}
      >
        <TabsList aria-label="Asset views">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
      </Tabs>

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
