import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'

export interface CurrentSlotCardProps {
  timeRange: string
  pricePerKwh: string
  remainingLabel: string
  exportKw: string
  progressPercent: number
}

export function CurrentSlotCard({
  timeRange,
  pricePerKwh,
  remainingLabel,
  exportKw,
  progressPercent,
}: CurrentSlotCardProps) {
  return (
    <Card className="gap-3 border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">
          Current 30-min slot
        </h3>
        <Badge className="gap-1 bg-brand-primary-muted text-brand-primary">
          <span className="size-1.5 rounded-full bg-brand-primary" />
          Live
        </Badge>
      </div>

      <p className="font-mono text-2xl font-semibold text-text-primary">
        {timeRange}
      </p>

      <p>
        <span className="text-lg font-semibold text-brand-primary">
          {pricePerKwh}
        </span>
        <span className="text-sm text-text-tertiary"> / kWh zone price</span>
      </p>

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-overlay">
          <div
            className="h-full rounded-full bg-brand-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-text-tertiary">
          <span>{remainingLabel} remaining</span>
          <span>Export: {exportKw}</span>
        </div>
      </div>
    </Card>
  )
}