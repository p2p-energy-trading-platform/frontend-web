import { useMemo } from 'react';

import { EChart } from '#/components/charts/EChart';
import { useChartColors } from '#/components/charts/theme';
import { IotDataState } from '#/components/page-components/IotDataState';
import { SampleBadge } from '#/components/page-components/SampleBadge';
import { Card } from '#/components/ui/card';
import { forecastChartOption } from '#/features/iot/chart-options';
import { useForecastSeries } from '#/hooks/useEnergyAssets';

/** Today's real solar output against a sample forecast curve (no forecast service yet). */
export function ForecastCard() {
  const series = useForecastSeries();
  const colors = useChartColors();
  const option = useMemo(
    () =>
      forecastChartOption(series.actual, series.forecast, colors, series.range),
    [series.actual, series.forecast, colors, series.range],
  );

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-heading-4 text-text-primary">
            Forecast vs actual
            <SampleBadge />
          </h3>
          <p className="text-xs text-text-tertiary">
            Solar generation · kW · Today
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold text-accent">
            {series.accuracyPercent}
          </p>
          <p className="text-xs text-text-tertiary">forecast accuracy</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-text-tertiary opacity-60" />
          Forecast
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent" />
          Actual
        </span>
      </div>

      {series.status === 'ready' ? (
        <EChart
          option={option}
          ariaLabel="Forecast and actual solar generation today"
          className="h-44 w-full"
        />
      ) : (
        <IotDataState
          status={series.status}
          onRetry={() => void series.retry()}
          skeletonClassName="h-44"
        />
      )}
    </Card>
  );
}
