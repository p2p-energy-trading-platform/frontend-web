import type { LucideIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface DeviceCardProps {
  icon: LucideIcon
  iconWrapClassName: string
  title: string
  subtitle: string
  statusLabel: string
  value: string
  valueLabel: string
  progressPercent?: number
  footnote: string
}

/** Used for Solar PV / Home Battery / EV cards — same component, different props. */
export function DeviceCard({
  icon: Icon,
  iconWrapClassName,
  title,
  subtitle,
  statusLabel,
  value,
  valueLabel,
  progressPercent,
  footnote,
}: DeviceCardProps) {
  return (
    <Card className="gap-3 border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-lg',
            iconWrapClassName,
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <Badge variant="outline" className="border-border-subtle text-text-tertiary">
          {statusLabel}
        </Badge>
      </div>

      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary">{subtitle}</p>
      </div>

      <p className="font-mono text-2xl font-semibold text-text-primary">
        {value}
        <span className="ml-1 text-sm font-normal text-text-tertiary">
          {valueLabel}
        </span>
      </p>

      {typeof progressPercent === 'number' && (
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg-overlay">
            <div
              className="h-full rounded-full bg-brand-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-text-tertiary">
            {progressPercent}%
          </div>
        </div>
      )}

      <p className="flex items-center gap-1 text-xs text-text-tertiary">
        <span className="text-[10px]">≡</span>
        {footnote}
      </p>
    </Card>
  )
}