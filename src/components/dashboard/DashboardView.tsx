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
import { IotDataState } from '#/components/page-components/IotDataState';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { useDashboard } from '#/hooks/useDashboard';

export default function DashboardView() {
  const dashboard = useDashboard();
  const { position, devices, flow } = dashboard;

  return (
    <main
      className="mx-auto flex w-full max-w-360 flex-col gap-5 p-6"
      data-source={dashboard.source}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-2 text-text-primary">
            {dashboard.greeting}
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

      {position.status === 'ready' && position.value ? (
        <EnergyPositionCard {...position.value} />
      ) : (
        <Card className="border-border-subtle bg-card p-5">
          <IotDataState
            status={position.status === 'ready' ? 'loading' : position.status}
            onRetry={() => void position.retry()}
            skeletonClassName="h-20"
          />
        </Card>
      )}

      {/* Wrapping row: each row's tiles stretch to fill it, so no tile is left with empty space beside it. */}
      <div className="flex flex-wrap gap-3">
        {dashboard.stats.map((stat) => (
          <StatTile
            key={stat.label}
            {...stat}
            className="min-w-0 grow basis-[calc((100%-0.75rem)/2-1px)] min-[1024px]:basis-[calc((100%-2.25rem)/4-1px)] min-[1400px]:basis-0"
          />
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
        {devices.status === 'ready' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
            {devices.cards.map((device) => (
              <DeviceCard key={device.title} {...device} />
            ))}
          </div>
        ) : (
          <Card className="border-border-subtle bg-card p-5">
            <IotDataState
              status={devices.status}
              onRetry={() => void devices.retry()}
            />
          </Card>
        )}
        {flow.status === 'ready' ? (
          <LiveEnergyFlowCard tiles={flow.tiles} />
        ) : (
          <Card className="border-border-subtle bg-card p-5">
            <IotDataState
              status={flow.status}
              onRetry={() => void flow.retry()}
            />
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <RecentActivityCard items={dashboard.activity} />
        <MarketCard {...dashboard.market} />
      </div>
    </main>
  );
}
