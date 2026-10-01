import { cn } from '#/lib/utils'

export type NotificationCategory =
  | 'All'
  | 'Trading'
  | 'Wallet'
  | 'Meter & assets'
  | 'Verification'
  | 'Forecast'
  | 'System'

export interface NotificationFilterBarProps {
  category: NotificationCategory
  onCategoryChange: (category: NotificationCategory) => void
  /** Unread count per category — categories without an entry show no badge */
  counts: Partial<Record<NotificationCategory, number>>
  onMarkAllRead?: () => void
}

const CATEGORIES: Array<NotificationCategory> = [
  'All',
  'Trading',
  'Wallet',
  'Meter & assets',
  'Verification',
  'Forecast',
  'System',
]

export function NotificationFilterBar({
  category,
  onCategoryChange,
  counts,
  onMarkAllRead,
}: NotificationFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((c) => {
          const count = counts[c]
          const active = c === category
          return (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                active
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border-subtle bg-secondary text-text-secondary hover:bg-muted',
              )}
            >
              {c}
              {typeof count === 'number' && count > 0 && (
                <span
                  className={cn(
                    'flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-text-tertiary',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        className="whitespace-nowrap text-xs font-medium text-accent hover:underline"
      >
        Mark all read
      </button>
    </div>
  )
}
