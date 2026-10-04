import { Link, useRouterState } from '@tanstack/react-router';
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  History,
  LayoutGrid,
  Menu,
  Settings,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet';
import { cn } from 'cn';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Energy', to: '/energy-assets', icon: Zap },
  { label: 'Trade', to: '/trade', icon: TrendingUp },
  { label: 'Wallet', to: '/wallet', icon: Wallet },
  { label: 'History', to: '/history/orders', icon: History },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/profile', icon: Settings },
] as const;

const navGroups = [navItems.slice(0, 4), navItems.slice(4)];

interface SidebarUser {
  name: string;
  property: string;
  zone: string;
  initials: string;
}

interface SidebarProps {
  user: SidebarUser;
}

export function MobileNavButton({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden"
        render={
          <Button variant="ghost" size="icon" aria-label="Open navigation" />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SidebarPanel user={user} collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all md:flex',
        collapsed ? 'w-19' : 'w-55',
      )}
    >
      <SidebarPanel
        user={user}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((current) => !current)}
      />
    </aside>
  );
}

function SidebarPanel({
  user,
  collapsed,
  onToggleCollapse,
}: SidebarProps & {
  collapsed: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="size-4.5 fill-current" />
        </span>
        {!collapsed && (
          <>
            <span className="text-base font-semibold text-sidebar-foreground">
              GridX
            </span>
            <Badge
              variant="outline"
              className="ml-auto border-sidebar-border text-sidebar-foreground/70"
            >
              Beta
            </Badge>
          </>
        )}
      </div>

      <div className="border-b border-sidebar-border py-2">
        <div className="mx-2 flex w-[calc(100%-1rem)] items-center gap-2 rounded-lg px-2 py-2 text-left">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {user.initials}
          </span>
          {!collapsed && (
            <>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user.property} · {user.zone}
                </span>
              </span>
              <ChevronDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/50" />
            </>
          )}
        </div>
      </div>

      <nav className="flex flex-1 flex-col px-2 py-2">
        {navGroups.map((group, groupIndex) => (
          <div
            key={group[0]?.label}
            className={cn(
              'flex flex-col gap-0.5 py-1',
              groupIndex > 0 && 'mt-2 border-t border-sidebar-border pt-3',
            )}
          >
            {group.map((item) => {
              const Icon = item.icon;
              const active =
                item.to === '/history/orders'
                  ? pathname.startsWith('/history')
                  : pathname === item.to;
              const className = cn(
                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium no-underline transition',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              );

              return (
                <Link key={item.to} to={item.to} className={className}>
                  <Icon className="size-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="m-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ChevronsLeft
            className={cn(
              'size-4.5 transition-transform',
              collapsed && 'rotate-180',
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </>
  );
}
