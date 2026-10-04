import { Link, useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Bell, ChevronDown, Home, HelpCircle } from 'lucide-react';

import { Avatar, AvatarFallback } from '#/components/ui/avatar';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import ThemeToggle from '#/components/ThemeToggle';
import { cn } from 'cn';

interface PageHeaderProps {
  /** Extra control rendered at the start of the bar, such as the mobile nav button. */
  leading?: ReactNode;
  /** e.g. "Villa 47" */
  propertyName: string;
  /** e.g. "JLT Zone 4" */
  zoneLabel: string;
  /** Whether the smart meter is currently reporting */
  meterOnline?: boolean;
  /** Unread notification count shown on the bell icon */
  notificationCount?: number;
  /** Currently signed-in user */
  user: {
    name: string;
    role: string;
    /** 2-letter avatar initials, e.g. "SA" */
    initials: string;
  };
  /** Route to send the user to when they click the property/help/bell area — defaults to the dashboard */
  dashboardHref?: string;
  onZoneClick?: () => void;
  onHelpClick?: () => void;
  onNotificationsClick?: () => void;
  onUserMenuClick?: () => void;
}

export default function PageHeader({
  leading,
  propertyName,
  meterOnline = true,
  notificationCount = 0,
  user,
  dashboardHref = '/dashboard',
  onHelpClick,
  onNotificationsClick,
  onUserMenuClick,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
      return;
    }

    navigate({ to: '/notifications' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-card">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        {leading}
        {/* Left: property + zone + meter status */}
        <Link
          to={dashboardHref}
          className="max-sm:hidden inline-flex items-center gap-2 rounded-lg px-1.5 py-1 text-text-primary no-underline transition hover:bg-secondary"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-accent">
            <Home className="size-4" />
          </span>
          <span className="text-sm font-semibold">{propertyName}</span>
        </Link>

        <Badge
          variant="outline"
          className="gap-1.5 border-border-subtle bg-secondary px-2.5 py-1 text-text-secondary"
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              meterOnline ? 'bg-accent' : 'bg-text-tertiary',
            )}
          />
          Meter {meterOnline ? 'online' : 'offline'}
        </Badge>

        {/* Right: theme, help, notifications, user */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Help"
            onClick={onHelpClick}
            className="max-sm:hidden"
          >
            <HelpCircle className="size-4.5 text-text-secondary" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={handleNotificationsClick}
            className="relative"
          >
            <Bell className="size-4.5 text-text-secondary" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-caption font-semibold leading-none text-accent-foreground">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>

          <Link
            to="/profile"
            onClick={onUserMenuClick}
            className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 no-underline transition hover:bg-bg-elevated"
          >
            <Avatar className="size-8 border border-accent/30 bg-accent shadow-sm ring-2 ring-accent/10">
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium text-text-primary">
                {user.name}
              </span>
              <span className="text-xs text-text-tertiary">{user.role}</span>
            </span>
            <ChevronDown className="size-3.5 text-text-tertiary" />
          </Link>
        </div>
      </div>
    </header>
  );
}
