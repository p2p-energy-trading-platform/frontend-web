import { ArrowDownLeft, Battery, Sun, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface EnergySourceSplit {
  label: string
  value: string
}

export interface EnergySourceRow {
  icon: LucideIcon
  iconClassName: string
  label: string
  total: string
  /** relative widths (0-100) for the stacked bar segments, same order as splits */
  segmentWidths: Array<number>
  splits: Array<EnergySourceSplit>
}

export interface EnergyBalanceCardProps {
  summary: Array<{
    icon: LucideIcon
    iconClassName?: string
    value: string
    label: string
  }>
  sources: Array<EnergySourceRow>
  exportEarnings: string
}

export function EnergyBalanceCard({
  summary,
  sources,
  exportEarnings,
}: EnergyBalanceCardProps) {
  return (
    <Card className="gap-5 border-border-subtle bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Energy balance</h3>
        <Badge
          variant="outline"
          className="border-border-subtle text-text-tertiary"
        >
          Today
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {summary.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg p-3',
                s.iconClassName ?? 'bg-secondary text-text-secondary',
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              <div className="min-w-0 leading-tight">
                <p className="truncate font-mono text-sm font-semibold">
                  {s.value}
                </p>
                <p className="truncate text-xs opacity-80">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-5">
        {sources.map((source) => {
          const Icon = source.icon
          return (
            <div key={source.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex size-6 items-center justify-center rounded-md',
                      source.iconClassName,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {source.label}
                  </span>
                </span>
                <span className="font-mono text-sm text-text-primary">
                  {source.total}
                </span>
              </div>

              <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
                {source.segmentWidths.map((w, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-full',
                      i === 0 && 'bg-accent',
                      i === 1 && 'bg-chart-4',
                      i === 2 && 'bg-chart-3',
                    )}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {source.splits.map((split) => (
                  <span
                    key={split.label}
                    className="flex items-center gap-1.5 text-xs text-text-tertiary"
                  >
                    <span className="size-1.5 rounded-full bg-text-tertiary" />
                    {split.label}
                    <span className="font-mono text-text-secondary">
                      {split.value}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-4">
        <span className="text-sm text-text-secondary">Grid export earned</span>
        <span className="text-lg font-semibold text-accent">
          {exportEarnings}
        </span>
      </div>
    </Card>
  )
}

export const energyBalanceIcons = { Sun, Zap, Battery, ArrowDownLeft }
