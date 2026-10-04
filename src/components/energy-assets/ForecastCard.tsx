import { Card } from '#/components/ui/card';
import { useForecastSeries } from '#/hooks/useEnergyAssets';

export interface ForecastCardProps {
  /** 0-1 normalized forecast curve */
  forecast?: Array<number>;
  /** 0-1 normalized actual points (dots) */
  actual?: Array<number>;
  accuracyPercent?: string;
}

export function ForecastCard({
  forecast,
  actual,
  accuracyPercent,
}: ForecastCardProps) {
  const series = useForecastSeries();
  const forecastPoints = forecast ?? series.forecast;
  const actualPoints = actual ?? series.actual;
  const accuracy = accuracyPercent ?? series.accuracyPercent;
  const width = 900;
  const height = 160;
  const step = width / (forecastPoints.length - 1);

  const forecastPath = forecastPoints
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - v * height}`)
    .join(' ');

  const xLabels = series.xLabels;
  const yLabels = series.yLabels;

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-heading-4 text-text-primary">
            Forecast vs actual
          </h3>
          <p className="text-xs text-text-tertiary">
            Solar generation · kW · Today
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold text-accent">
            {accuracy}
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

      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-1 text-xs text-text-tertiary">
          {yLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-36 w-full"
            preserveAspectRatio="none"
          >
            {yLabels.map((_, i) => (
              <line
                key={i}
                x1={0}
                x2={width}
                y1={(height / (yLabels.length - 1)) * i}
                y2={(height / (yLabels.length - 1)) * i}
                className="stroke-border-subtle"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            <path
              d={forecastPath}
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeLinecap="round"
            />

            {actualPoints.map((v, i) => (
              <circle
                key={i}
                cx={i * step}
                cy={height - v * height}
                r={4}
                fill="var(--action-accent)"
              />
            ))}
          </svg>

          <div className="mt-1 flex justify-between text-xs text-text-tertiary">
            {xLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
