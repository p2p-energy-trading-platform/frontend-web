import { useState } from 'react';

import { EChart } from '#/components/charts/EChart';
import { useChartColors } from '#/components/charts/theme';
import { IotDataState } from '#/components/page-components/IotDataState';
import { Card } from '#/components/ui/card';
import { generationChartOption } from '#/features/iot/chart-options';
import { useGenerationSeries } from '#/hooks/useDashboard';
import type { GenerationPeriod } from '#/hooks/useDashboard';
import { cn } from 'cn';

const PERIODS: Array<GenerationPeriod> = ['Day', 'Week', 'Month'];

export function GenerationChart() {
  const [period, setPeriod] = useState<GenerationPeriod>('Day');
  const series = useGenerationSeries(period);
  const colors = useChartColors();
  const option = generationChartOption(series.buckets, colors, series.range);

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h3 className="text-heading-4 text-text-primary">
            Generation vs. Consumption
          </h3>
          <Legend swatchClass="bg-accent" label="Generated" />
          <Legend swatchClass="bg-text-tertiary" label="Consumed" dashed />
          <Legend swatchClass="bg-chart-4" label="Exported" />
        </div>

        <div className="inline-flex rounded-lg border border-border-subtle bg-secondary p-0.5 text-xs font-medium">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === period}
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded-md px-3 py-1 transition',
                p === period
                  ? 'bg-card text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {series.status === 'ready' ? (
        <EChart
          option={option}
          ariaLabel="Generation and consumption over time"
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

/** Private helper — only used inside GenerationChart, so it lives here rather than its own file. */
function Legend({
  swatchClass,
  label,
  dashed,
}: {
  swatchClass: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
      <span
        className={cn(
          'h-0.5 w-3 rounded-full',
          swatchClass,
          dashed && 'opacity-60',
        )}
      />
      {label}
    </span>
  );
}
