import type { LucideIcon } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { Button } from '../ui/button'

export interface QuickAction {
  label: string
  icon: LucideIcon
  onClick?: () => void
  primary?: boolean
}

export function QuickActionsCard({ actions }: { actions: Array<QuickAction> }) {
  return (
    <Card className="gap-3 border-border-subtle bg-card p-4">
      <h3 className="text-heading-4 text-text-primary">Quick actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              // type="button"
              onClick={action.onClick}
              // className={cn(
              //   'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition',
              //   action.primary
              //     ? 'bg-accent text-accent-foreground hover:brightness-95'
              //     : 'bg-secondary text-text-primary hover:bg-muted',
              // )}
              variant={action.primary ? 'default' : 'secondary'}
            >
              <Icon className="size-4" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
