import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react'

import type { MarketSnapshot } from '#/lib/market-data'
import { getPercentageChange } from '#/lib/market-data'
import { cn } from '#/lib/utils'

interface MarketSummaryProps {
  snapshot: MarketSnapshot
}

export function MarketSummary({ snapshot }: MarketSummaryProps) {
  const change = getPercentageChange(snapshot)
  const increasing = change >= 0
  const marketOpen = snapshot.status === 'open'
  const updatedLabel = snapshot.updatedAt
    ? new Intl.DateTimeFormat('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(snapshot.updatedAt)
    : 'Connecting…'

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.16em] text-text-tertiary">
            Peer-to-peer market
          </p>
          <h1 className="mt-1 text-heading-1 text-text-primary">
            Trading Terminal
          </h1>
        </div>
        <div
          role="status"
          aria-label={`Market ${marketOpen ? 'Open' : 'Closed'}`}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
            marketOpen
              ? 'border-accent/25 bg-accent/10 text-accent'
              : 'border-destructive/25 bg-destructive/10 text-destructive',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-2 rounded-full',
              marketOpen ? 'animate-pulse bg-accent' : 'bg-destructive',
            )}
          />
          Market {marketOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      <section
        aria-labelledby="market-summary-heading"
        className="grid gap-4 rounded-xl border border-border-subtle bg-card p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,1fr)]"
      >
        <div className="border-border-subtle xl:border-r">
          <h2
            id="market-summary-heading"
            className="text-xs font-medium text-text-tertiary"
          >
            ENERGY / RM
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <output
              aria-live="polite"
              aria-label={`Current energy price RM ${snapshot.currentPrice.toFixed(3)} per kilowatt-hour`}
              className="text-3xl font-semibold tracking-tight text-text-primary"
            >
              RM {snapshot.currentPrice.toFixed(3)}{' '}
              <small className="text-sm font-normal text-text-tertiary">
                /kWh
              </small>
            </output>
            <span
              aria-label={`${increasing ? 'Increased' : 'Decreased'} ${Math.abs(change).toFixed(1)} percent over 24 hours`}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                increasing
                  ? 'bg-accent/10 text-accent'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {increasing ? (
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              ) : (
                <ArrowDownRight aria-hidden="true" className="size-3.5" />
              )}
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-tertiary">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {marketOpen ? 'Live' : 'Last market update'} · {updatedLabel}
          </p>
        </div>

        {[
          ['24h High', `RM ${snapshot.high24h.toFixed(3)}`],
          ['24h Low', `RM ${snapshot.low24h.toFixed(3)}`],
          ['24h Volume', `${snapshot.volume24h.toLocaleString('en-MY')} kWh`],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col justify-center">
            <span className="text-xs text-text-tertiary">{label}</span>
            <strong className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
              {value}
            </strong>
          </div>
        ))}
      </section>
    </>
  )
}
