import { Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '#/lib/utils'

import type { OrderSide } from './types'

const asks = [
  [0.476, 148],
  [0.475, 224],
  [0.474, 95],
  [0.473, 310],
  [0.472, 182],
] as const
const bids = [
  [0.47, 265],
  [0.469, 144],
  [0.468, 380],
  [0.467, 216],
  [0.466, 105],
] as const

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

export function OrderBook() {
  const [liveAsks, setLiveAsks] = useState(
    asks.map((row) => [...row] as [number, number]),
  )
  const [liveBids, setLiveBids] = useState(
    bids.map((row) => [...row] as [number, number]),
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      const update = (rows: Array<[number, number]>) =>
        rows.map(
          ([price, quantity]) =>
            [
              price,
              Math.max(20, quantity + Math.round((Math.random() - 0.5) * 18)),
            ] as [number, number],
        )
      setLiveAsks(update)
      setLiveBids(update)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [])

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
            ['Asks', liveAsks, 'sell'],
            ['Bids', liveBids, 'buy'],
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
            <div className="grid grid-cols-3 border-b border-border-subtle pb-1 text-[10px] uppercase tracking-wide text-text-tertiary">
              <span>Price (RM)</span>
              <span className="text-right">Qty (kWh)</span>
              <span className="text-right">Total (RM)</span>
            </div>
            {rows.map((row) => (
              <OrderBookRow key={row[0]} row={row} side={side} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-bg-elevated py-2 text-xs text-text-secondary">
        <Activity className="size-3.5 text-accent" /> Spread:{' '}
        <strong className="text-text-primary">RM 0.002</strong>
      </div>
    </section>
  )
}
