import { MoreHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

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

const controlModeClass: Record<AssetControlMode, string> = {
  Controllable: 'text-accent',
  'Monitoring only': 'text-chart-4',
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
  lastUpdated,
  controlMode,
  onClick,
  onMenuClick,
}: AssetCardProps) {
  return (
    <div className="relative rounded-2xl border border-border-subtle bg-card p-[17px] shadow-sm">
      <button
        type="button"
        onClick={onClick}
        aria-label={`View ${name}`}
        className="absolute inset-0 rounded-2xl"
      />

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
          <span className="text-[11px] font-semibold text-text-tertiary">
            {status}
          </span>
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="More options"
            className="flex size-6 items-center justify-center rounded-[10px] text-text-tertiary transition hover:bg-secondary hover:text-text-primary"
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative mt-3 flex items-baseline gap-1.5">
        <span
          className={cn('font-mono text-xl font-extrabold', statValueClassName)}
        >
          {statValue}
        </span>
        <span className="text-xs text-text-tertiary">{statUnit}</span>
        <span className="text-[10px] text-text-tertiary">{statLabel}</span>
      </div>

      {typeof socPercent === 'number' && (
        <div className="relative mt-2">
          <div className="flex items-center justify-between text-[10px]">
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
          <span className="w-10 text-[10px] font-semibold text-text-tertiary">
            {health}
          </span>
        </div>
        <div className="flex flex-col items-end text-[9px] leading-tight">
          <span className="font-mono text-text-tertiary">{lastUpdated}</span>
          <span className={cn('font-semibold', controlModeClass[controlMode])}>
            {controlMode}
          </span>
        </div>
      </div>
    </div>
  )
}
