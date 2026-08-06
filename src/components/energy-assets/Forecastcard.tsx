import { Card } from '#/components/ui/card'

export interface ForecastCardProps {
  /** 0-1 normalized forecast curve */
  forecast?: Array<number>
  /** 0-1 normalized actual points (dots) */
  actual?: Array<number>
  accuracyPercent: string
}

const DEFAULT_FORECAST = [
  0.05, 0.15, 0.35, 0.55, 0.72, 0.85, 0.92, 0.88, 0.75, 0.55, 0.35, 0.15, 0.05,
]
const DEFAULT_ACTUAL = [
  0.04, 0.13, 0.32, 0.5, 0.7, 0.82, 0.9, 0.85, 0.72, 0.5, 0.3, 0.12, 0.04,
]

export function ForecastCard({
  forecast = DEFAULT_FORECAST,
  actual = DEFAULT_ACTUAL,
  accuracyPercent,
}: ForecastCardProps) {
  const width = 900
  const height = 160
  const step = width / (forecast.length - 1)

  const forecastPath = forecast
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - v * height}`)
    .join(' ')

  const xLabels = [
    '06:00',
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
  ]
  const yLabels = ['4kW', '3kW', '2kW', '1kW', '0kW']

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
            {accuracyPercent}
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
              stroke="var(--text-tertiary, #8a94a6)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeLinecap="round"
            />

            {actual.map((v, i) => (
              <circle
                key={i}
                cx={i * step}
                cy={height - v * height}
                r={4}
                fill="var(--action-accent, #0ea592)"
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
  )
}
