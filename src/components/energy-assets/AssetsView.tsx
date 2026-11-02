import { useState } from 'react';

import { cn } from 'cn';
import { AssetCard } from '#/components/energy-assets/AssetCard';
import { AssetFilterBar } from '#/components/energy-assets/AssetFilterBar';
import type {
  AssetCategory,
  AssetSort,
} from '#/components/energy-assets/AssetFilterBar';
import { IotDataState } from '#/components/page-components/IotDataState';
import { Card } from '#/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { useEnergyAssets } from '#/hooks/useEnergyAssets';

export function AssetsView() {
  const energy = useEnergyAssets();
  const [subTab, setSubTab] = useState<'devices' | 'automation'>('devices');
  const [category, setCategory] = useState<AssetCategory>('All assets');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<AssetSort>('name');
  const visibleAssets = [...energy.assets]
    .filter((asset) => category === 'All assets' || asset.category === category)
    .sort((first, second) => {
      if (sort === 'output') {
        return (
          Math.abs(Number(second.statValue)) - Math.abs(Number(first.statValue))
        );
      }
      if (sort === 'status') return first.status.localeCompare(second.status);
      return first.name.localeCompare(second.name);
    });

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={subTab}
        onValueChange={(value) => {
          if (value === 'devices' || value === 'automation') setSubTab(value);
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

          {energy.status !== 'ready' && (
            <Card className="border-border-subtle bg-card p-5">
              <IotDataState
                status={energy.status}
                onRetry={() => void energy.retry()}
              />
            </Card>
          )}

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
  );
}
