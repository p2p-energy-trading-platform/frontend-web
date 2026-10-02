import { Card } from '#/components/ui/card'
import { useGenerationSeries } from '#/hooks/useDashboard'
import { cn } from 'cn'

// Replace with proper charts

export interface GenerationChartProps {
  /** 0-1 normalized points across the day, left to right */
  points?: Array<number>
  range?: 'Day' | 'Week' | 'Month'
  onRangeChange?: (range: 'Day' | 'Week' | 'Month') => void
}

export function GenerationChart({
  points,
  range = 'Day',
  onRangeChange,
}: GenerationChartProps) {
  const series = useGenerationSeries()
  const chartPoints = points ?? series.points
  const width = 900
  const height = 260
  const paddingBottom = 24
  const chartHeight = height - paddingBottom

  const step = width / (chartPoints.length - 1)
  const coords = chartPoints.map((p, i) => [
    i * step,
    chartHeight - p * chartHeight,
  ])

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')

  const areaPath = `${linePath} L ${width} ${chartHeight} L 0 ${chartHeight} Z`

  const yLabels = series.yLabels
  const xLabels = series.xLabels

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
          {(['Day', 'Week', 'Month'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange?.(r)}
              className={cn(
                'rounded-md px-3 py-1 transition',
                r === range
                  ? 'bg-card text-text-primary shadow-sm'
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
                  stopColor="var(--action-accent)"
                  stopOpacity="0.35"
                />
                <stop
                  offset="100%"
                  stopColor="var(--action-accent)"
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
              stroke="var(--action-accent)"
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
