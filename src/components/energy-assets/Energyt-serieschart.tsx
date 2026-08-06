import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface EnergyTimeSeriesChartProps {
  /** 0-1 normalized values, one entry per series, left to right across the day */
  generated?: Array<number>
  consumed?: Array<number>
  nowIndex?: number
}

const DEFAULT_GENERATED = [
  0, 0, 0, 0.02, 0.08, 0.25, 0.5, 0.75, 0.92, 1, 0.96, 0.85, 0.65, 0.4, 0.18,
  0.05, 0, 0, 0, 0, 0, 0, 0, 0,
]
const DEFAULT_CONSUMED = [
  0.2, 0.18, 0.15, 0.15, 0.2, 0.3, 0.4, 0.45, 0.42, 0.4, 0.42, 0.5, 0.55, 0.5,
  0.45, 0.5, 0.6, 0.75, 0.9, 0.85, 0.6, 0.4, 0.3, 0.22,
]

function toPath(values: Array<number>, width: number, height: number) {
  const step = width / (values.length - 1)
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - v * height}`)
    .join(' ')
}

export function EnergyTimeSeriesChart({
  generated = DEFAULT_GENERATED,
  consumed = DEFAULT_CONSUMED,
  nowIndex = 12,
}: EnergyTimeSeriesChartProps) {
  const width = 900
  const height = 220
  const genPath = toPath(generated, width, height)
  const conPath = toPath(consumed, width, height)
  const nowX = (nowIndex / (generated.length - 1)) * width

  const yLabels = ['2 kW', '1.5 kW', '1 kW', '0.5 kW', '0 kW']
  const xLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-heading-4 text-text-primary">Energy time series</h3>
          <p className="text-xs text-text-tertiary">30-min resolution · GST</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <Legend colorClass="bg-accent" label="Generated" />
          <Legend colorClass="bg-text-tertiary" label="Consumed" />
          <Legend colorClass="bg-chart-4" label="Exported" />
          <Legend colorClass="bg-chart-3" label="Imported" />
        </div>
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
            className="h-48 w-full"
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

            {/* "Now" marker */}
            <line
              x1={nowX}
              x2={nowX}
              y1={0}
              y2={height}
              className="stroke-text-tertiary"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={nowX + 4}
              y={12}
              className="fill-text-tertiary text-[10px]"
            >
              Now
            </text>

            <path
              d={conPath}
              fill="none"
              stroke="var(--text-tertiary, #8a94a6)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
            <path
              d={genPath}
              fill="none"
              stroke="var(--action-accent, #0ea592)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

function Legend({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2 rounded-full', colorClass)} />
      {label}
    </span>
  )
}