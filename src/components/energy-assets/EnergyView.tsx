import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { AssetsView } from '#/components/energy-assets/AssetsView';
import { GenerationUsageView } from '#/components/energy-assets/GenerationUsageView';
import { HouseSelect } from '#/components/energy-assets/HouseSelect';
import { useEnergyMeta } from '#/hooks/useEnergyAssets';

export default function EnergyView() {
  const meta = useEnergyMeta();
  const [tab, setTab] = useState<'usage' | 'assets'>('usage');

  return (
    <main
      className="mx-auto flex w-full max-w-360 flex-col gap-5 p-6"
      data-source="live"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-2 text-text-primary">Energy</h1>
        <HouseSelect
          houses={meta.houses}
          value={meta.selectedHouseId}
          onChange={meta.setHouseId}
        />
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (value === 'usage' || value === 'assets') setTab(value);
        }}
      >
        <TabsList aria-label="Energy views">
          <TabsTrigger value="usage">Generation &amp; Usage</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'usage' ? <GenerationUsageView /> : <AssetsView />}
    </main>
  );
}
