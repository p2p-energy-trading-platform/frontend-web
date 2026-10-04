import type { LucideIcon } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'

import { cn } from 'cn'
import { Button } from '../ui/button'

export interface NotificationItemData {
  id: string
  icon: LucideIcon
  iconClassName: string
  title: string
  time: string
  description: string
  actionLabel?: string
  onAction?: () => void
  unread?: boolean
}

export function NotificationItem({
  icon: Icon,
  iconClassName,
  title,
  time,
  description,
  actionLabel,
  onAction,
  unread,
  onDismiss,
}: NotificationItemData & { onDismiss?: () => void }) {
  return (
    <div className="flex gap-3 py-3">
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          iconClassName,
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {unread && (
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
            )}
            <p className="text-sm font-semibold text-text-primary">{title}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-xs text-text-tertiary">
            {time}
          </span>
        </div>

        <p className="mt-0.5 text-xs leading-relaxed text-text-tertiary">
          {description}
        </p>

        {actionLabel && (
          <Button
            size="xs"
            variant="link"
            onClick={onAction}
            className="text-accent"
          >
            {actionLabel}
          </Button>
        )}
      </div>

      <Button
        size={"icon-sm"}
        variant="ghost"
        onClick={onDismiss}
        aria-label="More options"
      >
        <MoreHorizontal className="size-3.5" />
      </Button>
    </div>
  )
}
