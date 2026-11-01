import { useMemo } from 'react';

import { EChart } from '#/components/charts/EChart';
import { useChartColors } from '#/components/charts/theme';
import { IotDataState } from '#/components/page-components/IotDataState';
import { Card } from '#/components/ui/card';
import { peakHeatmapOption } from '#/features/iot/chart-options';
import { usePeakPeriods } from '#/hooks/useEnergyAssets';

export function PeakPeriodsCard() {
  const peak = usePeakPeriods();
  const colors = useChartColors();
  const option = useMemo(
    () => peakHeatmapOption(peak.matrix, colors),
    [peak.matrix, colors],
  );

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div>
        <h3 className="text-heading-4 text-text-primary">Peak usage periods</h3>
        <p className="text-xs text-text-tertiary">
          Average hourly consumption kW · last 4 weeks · GST
        </p>
      </div>

      {peak.status === 'ready' ? (
        <EChart
          option={option}
          ariaLabel="Average hourly consumption by weekday"
          className="h-72 w-full"
        />
      ) : (
        <IotDataState
          status={peak.status}
          onRetry={() => void peak.retry()}
          skeletonClassName="h-72"
        />
      )}
    </Card>
  );
}
