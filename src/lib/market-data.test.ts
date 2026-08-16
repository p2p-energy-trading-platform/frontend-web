import { describe, expect, it } from 'vitest'

import {
  advanceMarketSnapshot,
  getMarketStatus,
  getPercentageChange,
  initialMarketSnapshot,
} from './market-data'

describe('market data', () => {
  it('calculates positive and negative percentage changes', () => {
    expect(getPercentageChange(initialMarketSnapshot)).toBeCloseTo(4.677, 2)
    expect(
      getPercentageChange({
        ...initialMarketSnapshot,
        currentPrice: 0.44,
      }),
    ).toBeLessThan(0)
  })

  it('derives market status from Malaysia trading hours', () => {
    expect(getMarketStatus(new Date('2026-08-07T04:00:00Z'))).toBe('open')
    expect(getMarketStatus(new Date('2026-08-08T04:00:00Z'))).toBe('closed')
  })

  it('updates price, high, low, volume, and timestamp as one snapshot', () => {
    const now = new Date('2026-08-07T04:00:00Z')
    const snapshot = {
      ...initialMarketSnapshot,
      high24h: 0.47,
      low24h: 0.45,
    }
    const randomValues = [1, 0.5]
    const next = advanceMarketSnapshot(
      snapshot,
      now,
      () => randomValues.shift() ?? 0.5,
    )

    expect(next.currentPrice).toBeGreaterThan(snapshot.currentPrice)
    expect(next.high24h).toBe(next.currentPrice)
    expect(next.low24h).toBe(snapshot.low24h)
    expect(next.volume24h).toBeGreaterThan(snapshot.volume24h)
    expect(next.updatedAt).toBe(now.getTime())
  })

  it('does not move prices or volume while the market is closed', () => {
    const now = new Date('2026-08-08T04:00:00Z')
    const next = advanceMarketSnapshot(initialMarketSnapshot, now, () => 1)

    expect(next.currentPrice).toBe(initialMarketSnapshot.currentPrice)
    expect(next.volume24h).toBe(initialMarketSnapshot.volume24h)
    expect(next.status).toBe('closed')
  })
})
