import {useRouterState } from '@tanstack/react-router'
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  History,
  LayoutGrid,
  Settings,
  TrendingUp,
  Wallet,
  Zap,
  Activity,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Energy', to: '/energy', icon: Zap },
  { label: 'Trade', to: '/trade', icon: TrendingUp },
  { label: 'Forecast', to: '/forecast', icon: Activity },
  { label: 'Wallet', to: '/wallet', icon: Wallet },
  { label: 'History', to: '/history', icon: History },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
] as const

interface SidebarProps {
  user: {
    name: string
    property: string
    zone: string
    initials: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all',
        collapsed ? 'w-[76px]' : 'w-[220px]',
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4">
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

      {/* User summary */}
      <button
        type="button"
        className="mx-2 mb-2 flex items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-sidebar-accent"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-primary-foreground">
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
      </button>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.to

          return (
            <a
              key={item.to}
              href={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium no-underline transition',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </a>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
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
    </aside>
  )
}
