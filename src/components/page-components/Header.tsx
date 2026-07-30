import { Link } from '@tanstack/react-router'
import { Bell, ChevronDown, Home, HelpCircle } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface PageHeaderProps {
  /** e.g. "Villa 47" */
  propertyName: string
  /** e.g. "JLT Zone 4" */
  zoneLabel: string
  /** Whether the smart meter is currently reporting */
  meterOnline?: boolean
  /** Unread notification count shown on the bell icon */
  notificationCount?: number
  /** Currently signed-in user */
  user: {
    name: string
    role: string
    /** 2-letter avatar initials, e.g. "SA" */
    initials: string
  }
  /** Route to send the user to when they click the property/help/bell area — defaults to the dashboard */
  dashboardHref?: string
  onZoneClick?: () => void
  onHelpClick?: () => void
  onNotificationsClick?: () => void
  onUserMenuClick?: () => void
}

export default function PageHeader({
  propertyName,
  zoneLabel,
  meterOnline = true,
  notificationCount = 0,
  user,
  dashboardHref = '/dashboard',
  onZoneClick,
  onHelpClick,
  onNotificationsClick,
  onUserMenuClick,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-surface">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        {/* Left: property + zone + meter status */}
        <Link
          to={dashboardHref}
          className="inline-flex items-center gap-2 rounded-lg px-1.5 py-1 text-text-primary no-underline transition hover:bg-bg-elevated"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-bg-elevated text-text-secondary">
            <Home className="size-4" />
          </span>
          <span className="text-sm font-semibold">{propertyName}</span>
        </Link>

        <button
          type="button"
          onClick={onZoneClick}
          className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:bg-bg-overlay"
        >
          {zoneLabel}
          <ChevronDown className="size-3.5" />
        </button>

        <Badge
          variant="outline"
          className="gap-1.5 border-border-subtle bg-bg-elevated px-2.5 py-1 text-text-secondary"
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              meterOnline ? 'bg-brand-primary' : 'bg-text-tertiary',
            )}
          />
          Meter {meterOnline ? 'online' : 'offline'}
        </Badge>

        {/* Right: help, notifications, user */}
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Help"
            onClick={onHelpClick}
          >
            <HelpCircle className="size-4.5 text-text-secondary" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="size-4.5 text-text-secondary" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold leading-none text-destructive-foreground">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>

          <button
            type="button"
            onClick={onUserMenuClick}
            className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-bg-elevated"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {user.initials}
            </span>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium text-text-primary">
                {user.name}
              </span>
              <span className="text-xs text-text-tertiary">{user.role}</span>
            </span>
            <ChevronDown className="size-3.5 text-text-tertiary" />
          </button>
        </div>
      </div>
    </header>
  )
}
