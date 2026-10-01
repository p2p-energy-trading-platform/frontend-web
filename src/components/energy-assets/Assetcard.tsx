import { MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '#/lib/utils'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '@base-ui/react/button'

export type AssetHealth = 'Good' | 'Degraded' | 'Poor'
export type AssetStatus = 'Online' | 'Idle' | 'Offline'
export type AssetControlMode = 'Controllable' | 'Monitoring only'

export interface AssetCardProps {
  icon: LucideIcon
  iconWrapClassName: string
  name: string
  brandModel: string
  status: AssetStatus
  /** Big colored live-reading number, e.g. "+3.4" or "0" */
  statValue: string
  statValueClassName: string
  statUnit: string
  statLabel: string
  socPercent?: number
  health: AssetHealth
  healthPercent: number
  lastUpdated: string
  controlMode: AssetControlMode
  onClick?: () => void
  onMenuClick?: () => void
}

const statusDotClass: Record<AssetStatus, string> = {
  Online: 'bg-accent',
  Idle: 'bg-text-tertiary',
  Offline: 'bg-text-tertiary',
}

const healthBarClass: Record<AssetHealth, string> = {
  Good: 'bg-accent',
  Degraded: 'bg-chart-4',
  Poor: 'bg-destructive',
}

export function AssetCard({
  icon: Icon,
  iconWrapClassName,
  name,
  brandModel,
  status,
  statValue,
  statValueClassName,
  statUnit,
  statLabel,
  socPercent,
  health,
  healthPercent,
  onMenuClick,
}: AssetCardProps) {
  return (
    <Card className="shadow-sm">

      <CardHeader>
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                iconWrapClassName,
              )}
            >
              <Icon className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{name}</p>
              <p className="text-xs text-text-tertiary">{brandModel}</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1.5">
            <span className={cn('size-2 rounded-full', statusDotClass[status])} />
            <span className="text-xs font-semibold text-text-tertiary">
              {status}
            </span>
            <Button
              onClick={onMenuClick}
              aria-label="More options"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </div>
        </div>

      </CardHeader>

      <CardContent>
        <div className="relative mt-3 flex items-baseline gap-1.5">
          <span
            className={cn('font-mono text-xl font-extrabold', statValueClassName)}
          >
            {statValue}
          </span>
          <span className="text-sm text-text-tertiary">{statUnit}</span>
          <span className="text-sm text-text-tertiary">{statLabel}</span>
        </div>

        {typeof socPercent === 'number' && (
          <div className="relative mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">State of charge</span>
              <span className="font-mono text-text-primary">{socPercent}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${socPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative mt-3 flex items-center gap-2 border-t border-border-subtle pt-2.5">
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', healthBarClass[health])}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
            <span className="w-10 text-xs font-semibold text-text-tertiary">
              {health}
            </span>
          </div>
        </div>
      </CardContent>
        
    </Card>
  )
}
