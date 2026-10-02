import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router'

import { cn } from 'cn'

export const Route = createFileRoute('/_authenticated/history')({
  component: HistoryLayout,
})

function HistoryLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <main className="mx-auto flex w-full flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-2 text-text-primary">History</h1>
        <div className="inline-flex rounded-lg border border-border-subtle bg-secondary p-1 text-sm font-medium">
          <HistoryLink
            to="/history/orders"
            active={
              pathname.startsWith('/history/orders') || pathname === '/history'
            }
          >
            Orders
          </HistoryLink>
          <HistoryLink
            to="/history/trades"
            active={pathname.startsWith('/history/trades')}
          >
            Trades
          </HistoryLink>
        </div>
      </div>
      <Outlet />
    </main>
  )
}

function HistoryLink({
  to,
  active,
  children,
}: {
  to: '/history/orders' | '/history/trades'
  active: boolean
  children: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'rounded-md px-3 py-1.5 no-underline transition',
        active
          ? 'bg-card text-text-primary shadow-sm'
          : 'text-text-tertiary hover:text-text-secondary',
      )}
    >
      {children}
    </Link>
  )
}
