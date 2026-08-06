import type { LucideIcon } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface EnergyKpi {
  icon: LucideIcon
  iconClassName?: string
  value: string
  unit: string
  label: string
  trend: string
  trendClassName?: string
}

export function EnergyKpiStrip({ kpis }: { kpis: Array<EnergyKpi> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="gap-2.5 border-border-subtle bg-bg-surface p-4">
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-md bg-bg-elevated text-text-secondary',
                kpi.iconClassName,
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <p className="font-mono text-lg font-semibold text-text-primary">
              {kpi.value}
              <span className="ml-1 text-xs font-normal text-text-tertiary">
                {kpi.unit}
              </span>
            </p>
            <p className="text-xs text-text-tertiary">{kpi.label}</p>
            <p
              className={cn(
                'text-[11px] font-medium',
                kpi.trendClassName ?? 'text-text-tertiary',
              )}
            >
              {kpi.trend}
            </p>
          </Card>
        )
      })}
    </div>
  )
}