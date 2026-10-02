import { useEffect, useMemo, useState } from 'react'

import {
  formatTradeMoney,
  formatTradePrice,
  makeCandles,
  marketPairLabel,
  orderBookSeed,
  orderQuote,
  priceUnitLabel,
} from '#/data/trade'
import { MARKET_LOCALE } from '#/data/currency'
import { advanceMarketSnapshot, initialMarketSnapshot } from '#/lib/market-data'
import type { Timeframe } from '#/components/trade/types'

export function useMarketLabels() {
  return {
    source: 'demo' as const,
    pairLabel: marketPairLabel,
    locale: MARKET_LOCALE,
    unitLabel: priceUnitLabel,
    formatPrice: formatTradePrice,
    formatVolume(value: number) {
      return `${value.toLocaleString(MARKET_LOCALE)} kWh`
    },
  }
}

export function useMarket() {
  const labels = useMarketLabels()
  const [snapshot, setSnapshot] = useState(initialMarketSnapshot)

  useEffect(() => {
    setSnapshot((current) => advanceMarketSnapshot(current, new Date()))
    const timer = window.setInterval(() => {
      setSnapshot((current) => advanceMarketSnapshot(current, new Date()))
    }, 2500)
    return () => window.clearInterval(timer)
  }, [])

  return {
    ...labels,
    snapshot,
  }
}

export function useCandles(timeframe: Timeframe) {
  const candles = useMemo(() => makeCandles(timeframe), [timeframe])
  return {
    source: 'demo' as const,
    candles,
  }
}

export function useOrderBook() {
  const [asks, setAsks] = useState(orderBookSeed.asks)
  const [bids, setBids] = useState(orderBookSeed.bids)

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
      setAsks((rows) => update(rows))
      setBids((rows) => update(rows))
    }, 2200)
    return () => window.clearInterval(timer)
  }, [])

  const spread = asks[asks.length - 1][0] - bids[0][0]

  return {
    source: 'demo' as const,
    asks,
    bids,
    spreadLabel: formatTradePrice(spread),
    priceHeading: `Price (${priceUnitLabel.split('/')[0]})`,
    totalHeading: `Total (${priceUnitLabel.split('/')[0]})`,
  }
}

export function useOrderQuote() {
  return {
    source: 'demo' as const,
    ...orderQuote,
    availableBalanceLabel: formatTradeMoney(orderQuote.availableBalance),
    unitLabel: priceUnitLabel,
    formatMoney: formatTradeMoney,
  }
}
