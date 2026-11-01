import { useMemo } from 'react';

import { EChart } from '#/components/charts/EChart';
import { useChartColors } from '#/components/charts/theme';
import { IotDataState } from '#/components/page-components/IotDataState';
import { Card } from '#/components/ui/card';
import type { EnergyBucketSize, EnergySeriesRange } from '#/features/iot/api';
import { energySeriesChartOption } from '#/features/iot/chart-options';
import { useEnergySeriesData } from '#/hooks/useEnergyAssets';
import { cn } from 'cn';

const RESOLUTION: Record<EnergyBucketSize, string> = {
  '5m': '5-min',
  '15m': '15-min',
  '30m': '30-min',
  '1h': 'Hourly',
  '1d': 'Daily',
};

export function EnergyTimeSeriesChart({ range }: { range: EnergySeriesRange }) {
  const series = useEnergySeriesData(range);
  const colors = useChartColors();
  const option = useMemo(
    () =>
      energySeriesChartOption(
        series.buckets,
        colors,
        new Date().toISOString(),
        range,
      ),
    [series.buckets, colors, range],
  );

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-heading-4 text-text-primary">
            Energy time series
          </h3>
          <p className="text-xs text-text-tertiary">
            {RESOLUTION[range.bucket]} resolution · GST
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-text-tertiary">
          <Legend colorClass="bg-accent" label="Generated" />
          <Legend colorClass="bg-text-tertiary" label="Consumed" />
          <Legend colorClass="bg-chart-4" label="Exported" />
          <Legend colorClass="bg-chart-3" label="Imported" />
        </div>
      </div>

      {series.status === 'ready' ? (
        <EChart
          option={option}
          ariaLabel="Energy generated, consumed, exported and imported over time"
        />
      ) : (
        <IotDataState
          status={series.status}
          onRetry={() => void series.retry()}
          skeletonClassName="h-56"
        />
      )}
    </Card>
  );
}

function Legend({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', colorClass)} />
      {label}
    </span>
  );
}
