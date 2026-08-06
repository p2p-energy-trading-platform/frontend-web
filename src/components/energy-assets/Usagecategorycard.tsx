import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'

export interface UsageCategory {
  label: string
  valueKwh: number
  colorClass: string
  /** stroke color used in the donut segment, e.g. 'var(--brand-primary)' */
  strokeColor: string
}

export function UsageCategoryCard({
  categories,
}: {
  categories: Array<UsageCategory>
}) {
  const total = categories.reduce((sum, c) => sum + c.valueKwh, 0)
  const maxValue = Math.max(...categories.map((c) => c.valueKwh))

  // Build donut segments
  const radius = 46
  const circumference = 2 * Math.PI * radius
  let offsetAcc = 0
  const segments = categories.map((c) => {
    const fraction = c.valueKwh / total
    const dash = fraction * circumference
    const seg = {
      ...c,
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -offsetAcc,
    }
    offsetAcc += dash
    return seg
  })

  return (
    <Card className="gap-4 border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Usage by category</h3>
        <Badge variant="outline" className="border-border-subtle text-text-tertiary">
          Today
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        <svg viewBox="0 0 112 112" className="size-28 shrink-0 -rotate-90">
          <circle
            cx={56}
            cy={56}
            r={radius}
            fill="none"
            stroke="var(--border-subtle, #2a3142)"
            strokeWidth={14}
          />
          {segments.map((s) => (
            <circle
              key={s.label}
              cx={56}
              cy={56}
              r={radius}
              fill="none"
              stroke={s.strokeColor}
              strokeWidth={14}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
            />
          ))}
        </svg>

        <div className="min-w-0 flex-1 space-y-3">
          {categories.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-primary">
                  <span className={`size-2 rounded-full ${c.colorClass}`} />
                  {c.label}
                </span>
                <span className="font-mono text-text-secondary">
                  {c.valueKwh.toFixed(1)} kWh
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bg-overlay">
                <div
                  className={`h-full rounded-full ${c.colorClass}`}
                  style={{ width: `${(c.valueKwh / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}