import { Card } from '#/components/ui/card'
import { NotificationItem } from './Notificationitem'
import type { NotificationItemData } from './Notificationitem'

export interface NotificationGroup {
  dateLabel: string
  items: Array<NotificationItemData>
}

export function NotificationFeed({
  groups,
}: {
  groups: Array<NotificationGroup>
}) {
  return (
    <Card className="gap-0 divide-y divide-border-subtle border-border-subtle bg-card p-0">
      {groups.map((group) => (
        <div key={group.dateLabel} className="px-5 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            {group.dateLabel}
          </p>
          <div className="divide-y divide-border-subtle">
            {group.items.map((item) => (
              <NotificationItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      ))}
    </Card>
  )
}
