import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface ActivityItem {
  icon: LucideIcon
  iconClassName: string
  title: string
  subtitle: string
  amount?: string
  amountClassName?: string
  time: string
}

export function RecentActivityCard({
  items,
  onViewAll,
}: {
  items: Array<ActivityItem>
  onViewAll?: () => void
}) {
  return (
    <Card className="gap-1 border-border-subtle bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Recent activity</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-0.5 text-sm font-medium text-accent hover:underline"
        >
          View all
          <ArrowUpRight className="size-3.5 rotate-45" />
        </button>
      </div>

      <div className="divide-y divide-border-subtle">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-center gap-3 py-3">
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  item.iconClassName,
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {item.title}
                </p>
                <p className="truncate text-xs text-text-tertiary">
                  {item.subtitle}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {item.amount && (
                  <p
                    className={cn(
                      'font-mono text-sm font-semibold',
                      item.amountClassName ?? 'text-text-primary',
                    )}
                  >
                    {item.amount}
                  </p>
                )}
                <p className="text-xs text-text-tertiary">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
