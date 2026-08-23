import { useEffect, useState } from 'react'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { advanceMarketSnapshot, initialMarketSnapshot } from '#/lib/market-data'
import { cn } from '#/lib/utils'

import { MarketChart } from './MarketChart'
import { MarketSummary } from './MarketSummary'
import { OrderBook } from './OrderBook'
import { OrderPanel } from './OrderPanel'
import { timeframes } from './types'
import type { Timeframe } from './types'

const user = {
  name: 'Sara A.',
  role: 'Prosumer',
  initials: 'SA',
  property: 'Villa 47',
  zone: 'JLT Zone 4',
}

export function TradingTerminal() {
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
