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
import ForecastChart from '#/components/forecast/ForecastChart'
import ForecastHeader from '#/components/forecast/ForecastHeader'
import ForecastHeatmap from '#/components/forecast/ForecastHeatmap'
import ForecastInsights from '#/components/forecast/ForecastInsights'
import ForecastMetrics from '#/components/forecast/ForecastMetrics'
import ForecastFilters from '#/components/forecast/ForecastFilters'
import PriceDrivers from '#/components/forecast/PriceDrivers'

export const Route = createFileRoute('/forecast')({
  component: Forecast,
})

function Forecast() {
  const user = {
      name: 'Sara A.',
      role: 'Prosumer',
      initials: 'SA',
      property: 'Villa 47',
      zone: 'JLT Zone 4',
    }
  
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
              <ForecastHeader />

              <ForecastFilters />

              <ForecastMetrics />

              <ForecastChart />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                
                  <ForecastHeatmap />

                  <div className="flex flex-col gap-5">

                      <PriceDrivers />
                      <ForecastInsights />
                    
                  </div>

              </div>
          </main>
        </div>
      </div>
    )
}
