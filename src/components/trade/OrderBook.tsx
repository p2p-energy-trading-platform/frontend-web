import { Activity } from 'lucide-react'

import { cn } from 'cn'

import type { OrderSide } from './types'

function OrderBookRow({
  row,
  side,
}: {
  row: readonly [number, number]
  side: OrderSide
}) {
  return (
    <div className="grid grid-cols-3 py-1.5 text-xs tabular-nums">
      <span className={side === 'buy' ? 'text-accent' : 'text-destructive'}>
        {row[0].toFixed(3)}
      </span>
      <span className="text-right text-text-secondary">{row[1]}</span>
      <span className="text-right text-text-primary">
        {(row[0] * row[1]).toFixed(2)}
      </span>
    </div>
  )
}

export function OrderBook({
  asks,
  bids,
  spreadLabel,
  priceHeading,
  totalHeading,
}: {
  asks: Array<[number, number]>
  bids: Array<[number, number]>
  spreadLabel: string
  priceHeading: string
  totalHeading: string
}) {
  return (
    <section className="rounded-xl border border-border-subtle bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-heading-4 text-text-primary">Order Book</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">Live market depth</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-accent">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />{' '}
          Live
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {(
          [
            ['Asks', asks, 'sell'],
            ['Bids', bids, 'buy'],
          ] as const
        ).map(([label, rows, side]) => (
          <div key={label}>
            <span
              className={cn(
                'text-xs font-semibold',
                side === 'buy' ? 'text-accent' : 'text-destructive',
              )}
            >
              {label}
            </span>
            <div className="grid grid-cols-3 border-b border-border-subtle pb-1 text-caption uppercase tracking-wide text-text-tertiary">
              <span>{priceHeading}</span>
              <span className="text-right">Qty (kWh)</span>
              <span className="text-right">{totalHeading}</span>
            </div>
            {rows.map((row) => (
              <OrderBookRow key={row[0]} row={row} side={side} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-bg-elevated py-2 text-xs text-text-secondary">
        <Activity className="size-3.5 text-accent" /> Spread:{' '}
        <strong className="text-text-primary">{spreadLabel}</strong>
      </div>
    </section>
  )
}
