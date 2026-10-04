import { useState } from 'react'

import { cn } from 'cn'
import { useCandles, useMarket, useOrderBook } from '#/hooks/useTrade'

import { MarketChart } from './MarketChart'
import { MarketSummary } from './MarketSummary'
import { OrderBook } from './OrderBook'
import { OrderPanel } from './OrderPanel'
import { timeframes } from './types'
import type { Timeframe } from './types'

export default function TradingTerminalView() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1H')
  const market = useMarket()
  const candles = useCandles(timeframe)
  const book = useOrderBook()

  return (
    <main
      className="mx-auto flex w-full max-w-[1540px] flex-col gap-5 p-4 sm:p-6"
      data-source={market.source}
    >
      <MarketSummary snapshot={market.snapshot} />
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  {market.pairLabel}
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
            <MarketChart candles={candles.candles} />
          </section>
          <OrderBook
            asks={book.asks}
            bids={book.bids}
            spreadLabel={book.spreadLabel}
            priceHeading={book.priceHeading}
            totalHeading={book.totalHeading}
          />
        </div>
        <OrderPanel />
      </div>
    </main>
  )
}
