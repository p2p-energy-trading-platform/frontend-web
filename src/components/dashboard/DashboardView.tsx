import { Plus } from 'lucide-react';

import { StatTile } from '#/components/dashboard/StatTile';
import { EnergyPositionCard } from '#/components/dashboard/EnergyPositionCard';
import { GenerationChart } from '#/components/dashboard/GenerationChart';
import { DeviceCard } from '#/components/dashboard/DeviceCard';
import { QuickActionsCard } from '#/components/dashboard/QuickActionsCard';
import { CurrentSlotCard } from '#/components/dashboard/CurrentSlotCard';
import { LiveEnergyFlowCard } from '#/components/dashboard/LiveEnergyFlowCard';
import { RecentActivityCard } from '#/components/dashboard/RecentActivityCard';
import { MarketCard } from '#/components/dashboard/MarketCard';
import { Button } from '#/components/ui/button';
import { useDashboard } from '#/hooks/useDashboard';

export default function DashboardView() {
  const dashboard = useDashboard();

  return (
    <main
      className="mx-auto flex w-full max-w-360 flex-col gap-5 p-6"
      data-source={dashboard.source}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-2 text-text-primary">
            Good evening, {dashboard.greetingName} ☀️
          </h1>
          <p className="text-sm text-text-tertiary">{dashboard.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button>
            <Plus />
            Post listing
          </Button>
          <Button>Buy energy</Button>
        </div>
      </div>

      <EnergyPositionCard {...dashboard.position} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {dashboard.stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <GenerationChart />

        <div className="flex flex-col gap-5">
          <QuickActionsCard actions={dashboard.actions} />
          <CurrentSlotCard {...dashboard.slot} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dashboard.devices.map((device) => (
            <DeviceCard key={device.title} {...device} />
          ))}
        </div>
        <LiveEnergyFlowCard tiles={dashboard.flow} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <RecentActivityCard items={dashboard.activity} />
        <MarketCard {...dashboard.market} />
      </div>
    </main>
  );
}
