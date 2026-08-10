import { createFileRoute } from '@tanstack/react-router'
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
} from 'lightweight-charts'
import type {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts'
import { Activity, Info, Wallet, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { MarketSummary } from '#/components/trade/MarketSummary'
import { advanceMarketSnapshot, initialMarketSnapshot } from '#/lib/market-data'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/trade')({ component: TradingTerminal })

const user = {
  name: 'Sara A.',
  role: 'Prosumer',
  initials: 'SA',
  property: 'Villa 47',
  zone: 'JLT Zone 4',
}

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D'] as const
type Timeframe = (typeof timeframes)[number]
type Side = 'buy' | 'sell'
type OrderType = 'market' | 'limit'

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

function makeCandles(timeframe: Timeframe): Array<CandlestickData<Time>> {
  const interval: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
  }
  const step = interval[timeframe]
  const now = Math.floor(Date.now() / 1000 / step) * step
  let last = 0.444

  return Array.from({ length: 72 }, (_, index) => {
    const drift =
      Math.sin(index * 0.57) * 0.0026 + Math.cos(index * 0.21) * 0.0012
    const open = last
    const close = Math.max(0.41, open + drift)
    const high = Math.max(open, close) + 0.0012 + (index % 3) * 0.00035
    const low = Math.min(open, close) - 0.0011 - (index % 4) * 0.00025
    last = close
    return {
      time: (now - (71 - index) * step) as Time,
      open,
      high,
      low,
      close,
    }
  })
}

function MarketChart({ timeframe }: { timeframe: Timeframe }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const styles = getComputedStyle(document.documentElement)
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 390,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor:
          styles.getPropertyValue('--text-tertiary').trim() || '#6b7a99',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(107,122,153,.10)' },
        horzLines: { color: 'rgba(107,122,153,.10)' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: 'rgba(107,122,153,.18)' },
      timeScale: {
        borderColor: 'rgba(107,122,153,.18)',
        timeVisible: true,
        secondsVisible: false,
      },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#0ea592',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#0ea592',
      wickDownColor: '#ef4444',
      priceFormat: { type: 'price', precision: 3, minMove: 0.001 },
    })
    series.setData(makeCandles(timeframe))
    ;[0.47, 0.452].forEach((price) =>
      series.createPriceLine({
        price,
        color: price === 0.47 ? '#0ea592' : 'rgba(107,122,153,.6)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      }),
    )
    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      const tooltip = tooltipRef.current
      if (!tooltip || !param.time || !param.point) {
        if (tooltip) tooltip.style.display = 'none'
        return
      }
      const candle = param.seriesData.get(series) as
        CandlestickData<Time> | undefined
      if (!candle) return
      const stamp = new Date(Number(param.time) * 1000)
      tooltip.style.display = 'block'
      tooltip.style.left = `${Math.min(param.point.x + 14, (containerRef.current?.clientWidth ?? 300) - 195)}px`
      tooltip.style.top = `${Math.max(param.point.y - 70, 8)}px`
      tooltip.innerHTML = `<strong>${stamp.toLocaleString()}</strong><br/>O ${candle.open.toFixed(3)} &nbsp; H ${candle.high.toFixed(3)}<br/>L ${candle.low.toFixed(3)} &nbsp; C ${candle.close.toFixed(3)}`
    })

    const observer = new ResizeObserver(([entry]) => {
      chart.applyOptions({ width: entry.contentRect.width })
    })
    observer.observe(containerRef.current)
    chartRef.current = chart
    seriesRef.current = series
    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [timeframe])

  return (
    <div className="relative min-h-[390px] w-full" ref={containerRef}>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 hidden rounded-lg border border-border-default bg-card/95 px-3 py-2 text-xs leading-5 text-text-secondary shadow-lg backdrop-blur"
      />
    </div>
  )
}

function OrderBook() {
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

  const Row = ({
    row,
    side,
  }: {
    row: readonly [number, number]
    side: Side
  }) => (
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

  return (
    <section className="rounded-xl border border-border-subtle bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-heading-4 text-text-primary">Order Book</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">Live market depth</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-accent">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
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
            <div className="mb-1 flex items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold',
                  side === 'buy' ? 'text-accent' : 'text-destructive',
                )}
              >
                {label}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b border-border-subtle pb-1 text-[10px] uppercase tracking-wide text-text-tertiary">
              <span>Price (RM)</span>
              <span className="text-right">Qty (kWh)</span>
              <span className="text-right">Total (RM)</span>
            </div>
            <div>
              {rows.map((row) => (
                <Row key={row[0]} row={row} side={side} />
              ))}
            </div>
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

function OrderPanel() {
  const availableEnergy = 328.4
  const [side, setSide] = useState<Side>('buy')
  const [orderType, setOrderType] = useState<OrderType>('limit')
  const [amount, setAmount] = useState('25')
  const [price, setPrice] = useState('0.470')
  const quantity = Number(amount)
  const unitPrice =
    orderType === 'market' ? (side === 'buy' ? 0.472 : 0.47) : Number(price)
  const exceedsEnergyBalance = side === 'sell' && quantity > availableEnergy
  const valid = quantity > 0 && unitPrice > 0 && !exceedsEnergyBalance
  const subtotal = valid ? quantity * unitPrice : 0
  const fee = subtotal * 0.02
  const money = (value: number) => `RM ${value.toFixed(2)}`

  return (
    <section className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-sm">
      <div className="grid grid-cols-2 border-b border-border-subtle">
        {(['buy', 'sell'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSide(tab)}
            className={cn(
              'border-b-2 px-4 py-4 text-sm font-semibold transition',
              side === tab
                ? tab === 'buy'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-destructive bg-destructive/5 text-destructive'
                : 'border-transparent text-text-tertiary hover:bg-bg-elevated',
            )}
          >
            {tab === 'buy' ? 'Buy Energy' : 'Sell Energy'}
          </button>
        ))}
      </div>
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between rounded-lg bg-bg-elevated p-3">
          <span className="flex items-center gap-2 text-xs text-text-secondary">
            {side === 'buy' ? (
              <Wallet className="size-4 text-accent" />
            ) : (
              <Zap className="size-4 text-destructive" />
            )}
            {side === 'buy' ? 'Available Balance' : 'Available Energy'}
          </span>
          <strong className="text-sm text-text-primary">
            {side === 'buy' ? 'RM 2,847.50' : `${availableEnergy} kWh`}
          </strong>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-text-secondary">
            Order Type
          </label>
          <div className="grid grid-cols-2 rounded-lg bg-bg-elevated p-1">
            {(['market', 'limit'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={cn(
                  'rounded-md px-2 py-2 text-xs font-medium transition',
                  orderType === type
                    ? 'bg-card text-text-primary shadow-sm'
                    : 'text-text-tertiary',
                )}
              >
                {type === 'market' ? 'Market Order' : 'Limit Order'}
              </button>
            ))}
          </div>
          {exceedsEnergyBalance && (
            <p className="mt-2 text-xs text-destructive">
              Amount exceeds your available energy balance.
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-xs font-medium text-text-secondary"
          >
            Amount (kWh)
          </label>
          <div className="relative">
            <input
              id="amount"
              min="0"
              step="1"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 w-full rounded-lg border border-border-default bg-background px-3 pr-14 text-sm font-medium text-text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
            <span className="absolute right-3 top-3 text-xs text-text-tertiary">
              kWh
            </span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmount(String(preset))}
                className={cn(
                  'rounded-md border py-1.5 text-xs transition',
                  amount === String(preset)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-default text-text-secondary hover:bg-bg-elevated',
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="price"
            className="mb-2 flex items-center gap-1 text-xs font-medium text-text-secondary"
          >
            Price (RM/kWh)
            <Info className="size-3 text-text-tertiary" />
          </label>
          <div className="relative">
            <input
              id="price"
              min="0"
              step="0.001"
              type="number"
              disabled={orderType === 'market'}
              value={orderType === 'market' ? 'Best market price' : price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-11 w-full rounded-lg border border-border-default bg-background px-3 pr-20 text-sm font-medium text-text-primary outline-none disabled:bg-bg-elevated disabled:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
            <span className="absolute right-3 top-3 text-xs text-text-tertiary">
              RM/kWh
            </span>
          </div>
        </div>
        <div className="space-y-2 border-t border-border-subtle pt-4 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="tabular-nums text-text-primary">
              {money(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Platform Fee (2%)</span>
            <span className="tabular-nums text-text-primary">{money(fee)}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-semibold text-text-primary">
            <span>{side === 'buy' ? 'Total Cost' : 'Estimated Proceeds'}</span>
            <span className="tabular-nums">
              {money(side === 'buy' ? subtotal + fee : subtotal - fee)}
            </span>
          </div>
        </div>
        <button
          type="button"
          disabled={!valid}
          className={cn(
            'h-11 w-full rounded-lg text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40',
            side === 'buy'
              ? 'bg-accent hover:brightness-95'
              : 'bg-destructive hover:brightness-95',
          )}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {valid ? quantity : 0} kWh
        </button>
        <p className="text-center text-[11px] leading-4 text-text-tertiary">
          Orders are matched with verified participants in your energy zone.
        </p>
      </div>
    </section>
  )
}

function TradingTerminal() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1H')
  const [market, setMarket] = useState(initialMarketSnapshot)

  useEffect(() => {
    setMarket((current) => advanceMarketSnapshot(current, new Date()))
    const timer = window.setInterval(() => {
      setMarket((current) => advanceMarketSnapshot(current, new Date()))
    }, 2500)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          propertyName={user.property}
          zoneLabel={user.zone}
          meterOnline
          notificationCount={3}
          user={user}
        />
        <main className="mx-auto flex w-full max-w-[1540px] flex-col gap-5 p-4 sm:p-6">
          <MarketSummary snapshot={market} />

          <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
            <div className="flex min-w-0 flex-col gap-5">
              <section className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">
                      ENERGY / RM
                    </h2>
                    <p className="text-xs text-text-tertiary">Candlestick</p>
                  </div>
                  <div className="flex rounded-lg bg-bg-elevated p-1">
                    {timeframes.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setTimeframe(item)}
                        className={cn(
                          'rounded-md px-2.5 py-1.5 text-xs font-medium transition',
                          timeframe === item
                            ? 'bg-card text-accent shadow-sm'
                            : 'text-text-tertiary hover:text-text-primary',
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <MarketChart timeframe={timeframe} />
              </section>
              <OrderBook />
            </div>
            <OrderPanel />
          </div>
        </main>
      </div>
    </div>
  )
}
