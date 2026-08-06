import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface PeakPeriodsCardProps {
  /** 7 rows (Mon-Sun) x N hourly columns, each 0-1 intensity */
  matrix?: Array<Array<number>>
  hourLabels?: Array<string>
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function randomRow(peakHours: Array<number>, hours: number) {
  return Array.from({ length: hours }, (_, h) => {
    const nearPeak = peakHours.some((p) => Math.abs(p - h) <= 1)
    return nearPeak ? 0.7 + Math.random() * 0.3 : Math.random() * 0.4
  })
}

const DEFAULT_HOURS = 18 // 06:00 .. 23:00 step ~1
const DEFAULT_MATRIX = DAYS.map(() => randomRow([12, 19], DEFAULT_HOURS))

function intensityClass(v: number) {
  if (v > 0.66) return 'bg-brand-primary'
  if (v > 0.33) return 'bg-brand-primary/50'
  return 'bg-brand-primary/15'
}

export function PeakPeriodsCard({
  matrix = DEFAULT_MATRIX,
  hourLabels = ['06', '08', '10', '12', '14', '16', '18', '20', '22'],
}: PeakPeriodsCardProps) {
  return (
    <Card className="gap-4 border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Peak usage periods</h3>
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <Legend colorClass="bg-brand-primary/15" label="Low" />
          <Legend colorClass="bg-brand-primary/50" label="Mid" />
          <Legend colorClass="bg-brand-primary" label="Peak" />
        </div>
      </div>

      <div>
        <div
          className="mb-1 grid gap-1 pl-8 text-[11px] text-text-tertiary"
          style={{ gridTemplateColumns: `repeat(${hourLabels.length}, 1fr)` }}
        >
          {hourLabels.map((h) => (
            <span key={h} className="text-center">
              {h}
            </span>
          ))}
        </div>

        <div className="space-y-1">
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-[11px] text-text-tertiary">
                {day}
              </span>
              <div className="grid flex-1 grid-flow-col gap-1">
                {matrix[dayIdx].map((v, hourIdx) => (
                  <div
                    key={hourIdx}
                    className={cn('h-4 rounded-sm', intensityClass(v))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-text-tertiary">
          Hourly consumption kW · this week
        </p>
      </div>
    </Card>
  )
}

function Legend({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2.5 rounded-sm', colorClass)} />
      {label}
    </span>
  )
}