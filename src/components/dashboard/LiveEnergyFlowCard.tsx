import type { LucideIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface FlowTile {
  icon: LucideIcon
  label: string
  value: string
  tone: 'warning' | 'default' | 'primary' | 'info'
}

export function LiveEnergyFlowCard({ tiles }: { tiles: Array<FlowTile> }) {
  const toneClass: Record<FlowTile['tone'], string> = {
    warning: 'bg-brand-warning-muted text-brand-warning',
    default: 'bg-bg-elevated text-text-secondary',
    primary: 'bg-brand-primary-muted text-brand-primary',
    info: 'bg-brand-info-muted text-brand-info',
  }

  return (
    <Card className="gap-3 border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Live energy flow</h3>
        <Badge variant="outline" className="border-border-subtle text-text-tertiary">
          Now
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <div
              key={tile.label}
              className={cn(
                'flex items-center gap-2 rounded-lg p-3',
                toneClass[tile.tone],
              )}
            >
              <Icon className="size-4.5" />
              <div className="leading-tight">
                <p className="font-mono text-sm font-semibold">{tile.value}</p>
                <p className="text-xs opacity-80">{tile.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}