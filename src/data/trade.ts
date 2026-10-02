import type { CandlestickData, Time } from 'lightweight-charts'

import { formatAed } from '#/data/currency'
import type { Timeframe } from '#/components/trade/types'

export const orderQuote = {
  availableEnergyKwh: 328.4,
  availableBalance: 2847.5,
  marketBuyPrice: 0.472,
  marketSellPrice: 0.47,
  feeRate: 0.02,
  amountPresets: [10, 25, 50, 100],
  defaultAmount: '25',
  defaultPrice: '0.470',
}

export const orderBookSeed = {
  asks: [
    [0.476, 148],
    [0.475, 224],
    [0.474, 95],
    [0.473, 310],
    [0.472, 182],
  ] as Array<[number, number]>,
  bids: [
    [0.47, 265],
    [0.469, 144],
    [0.468, 380],
    [0.467, 216],
    [0.466, 105],
  ] as Array<[number, number]>,
}

export const marketPairLabel = 'ENERGY / AED'
export const priceUnitLabel = 'AED/kWh'

export function makeCandles(
  timeframe: Timeframe,
): Array<CandlestickData<Time>> {
  const intervals: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
  }
  const step = intervals[timeframe]
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

export function formatTradeMoney(value: number) {
  return formatAed(value)
}

export function formatTradePrice(value: number) {
  return formatAed(value, 3)
}
