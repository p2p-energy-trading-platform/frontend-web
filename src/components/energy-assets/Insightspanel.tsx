import type { LucideIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface Insight {
  icon: LucideIcon
  iconClassName: string
  title: string
  description: string
}

export function InsightsPanel({
  insights,
  newCount,
}: {
  insights: Array<Insight>
  newCount?: number
}) {
  return (
    <Card className="gap-0 divide-y divide-border-subtle border-border-subtle bg-bg-surface p-0">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-heading-4 text-text-primary">Insights</h3>
        {typeof newCount === 'number' && newCount > 0 && (
          <Badge className="bg-brand-primary-muted text-brand-primary">
            {newCount} new
          </Badge>
        )}
      </div>

      {insights.map((insight, i) => {
        const Icon = insight.icon
        return (
          <div key={i} className="flex gap-3 px-5 py-4">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-md',
                insight.iconClassName,
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {insight.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-tertiary">
                {insight.description}
              </p>
            </div>
          </div>
        )
      })}
    </Card>
  )
}