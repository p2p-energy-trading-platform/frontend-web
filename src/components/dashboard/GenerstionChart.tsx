import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface GenerationChartProps {
  /** 0-1 normalized points across the day, left to right */
  points?: Array<number>
  range?: 'Day' | 'Week' | 'Month'
  onRangeChange?: (range: 'Day' | 'Week' | 'Month') => void
}

const DEFAULT_POINTS = [
  0, 0, 0, 0.02, 0.05, 0.15, 0.35, 0.6, 0.82, 0.94, 1, 0.97, 0.88, 0.7, 0.45,
  0.22, 0.08, 0.02, 0, 0, 0, 0, 0, 0,
]

export function GenerationChart({
  points = DEFAULT_POINTS,
  range = 'Day',
  onRangeChange,
}: GenerationChartProps) {
  const width = 900
  const height = 260
  const paddingBottom = 24
  const chartHeight = height - paddingBottom

  const step = width / (points.length - 1)
  const coords = points.map((p, i) => [i * step, chartHeight - p * chartHeight])

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')

  const areaPath = `${linePath} L ${width} ${chartHeight} L 0 ${chartHeight} Z`

  const yLabels = ['8 kW', '6 kW', '4 kW', '2 kW', '0 kW']
  const xLabels = [
    '00:00',
    '02:00',
    '04:00',
    '06:00',
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
  ]

  return (
    <Card className="gap-4 border-border-subtle bg-bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h3 className="text-heading-4 text-text-primary">
            Generation vs. Consumption
          </h3>
          <Legend swatchClass="bg-brand-primary" label="Generated" />
          <Legend swatchClass="bg-text-tertiary" label="Consumed" dashed />
          <Legend swatchClass="bg-brand-info" label="Exported" />
        </div>

        <div className="inline-flex rounded-lg border border-border-subtle bg-bg-elevated p-0.5 text-xs font-medium">
          {(['Day', 'Week', 'Month'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange?.(r)}
              className={cn(
                'rounded-md px-3 py-1 transition',
                r === range
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {r}
            </button>
          ))}
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
            className="h-56 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="genFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--brand-primary, #0ea592)"
                  stopOpacity="0.35"
                />
                <stop
                  offset="100%"
                  stopColor="var(--brand-primary, #0ea592)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {yLabels.map((_, i) => (
              <line
                key={i}
                x1={0}
                x2={width}
                y1={(chartHeight / (yLabels.length - 1)) * i}
                y2={(chartHeight / (yLabels.length - 1)) * i}
                className="stroke-border-subtle"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            <path d={areaPath} fill="url(#genFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="var(--brand-primary, #0ea592)"
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

/** Private helper — only used inside GenerationChart, so it lives here rather than its own file. */
function Legend({
  swatchClass,
  label,
  dashed,
}: {
  swatchClass: string
  label: string
  dashed?: boolean
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
  )
}
