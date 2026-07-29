import type { LucideIcon } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface StatTileProps {
  icon: LucideIcon
  iconClassName?: string
  value: string
  label: string
}

export function StatTile({
  icon: Icon,
  iconClassName,
  value,
  label,
}: StatTileProps) {
  return (
    <Card className="gap-2 border-border-subtle bg-bg-surface p-4">
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-md bg-bg-elevated text-text-secondary',
          iconClassName,
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="font-mono text-lg font-semibold text-text-primary">
        {value}
      </span>
      <span className="text-xs text-text-tertiary">{label}</span>
    </Card>
  )
}