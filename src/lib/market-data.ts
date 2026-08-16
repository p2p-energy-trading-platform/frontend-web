export type MarketStatus = 'open' | 'closed'

export interface MarketSnapshot {
  currentPrice: number
  previousClose: number
  high24h: number
  low24h: number
  volume24h: number
  status: MarketStatus
  updatedAt: number
}

export const initialMarketSnapshot: MarketSnapshot = {
  currentPrice: 0.47,
  previousClose: 0.449,
  high24h: 0.481,
  low24h: 0.438,
  volume24h: 84620,
  status: 'open',
  updatedAt: 0,
}

/** Demo market hours: Monday-Friday, 08:00-22:00 Malaysia time. */
export function getMarketStatus(date: Date): MarketStatus {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const weekday = parts.find((part) => part.type === 'weekday')?.value
  const hour = Number(parts.find((part) => part.type === 'hour')?.value)
  const weekdayOpen = weekday !== 'Sat' && weekday !== 'Sun'
  return weekdayOpen && hour >= 8 && hour < 22 ? 'open' : 'closed'
}

export function getPercentageChange(snapshot: MarketSnapshot) {
  return (
    ((snapshot.currentPrice - snapshot.previousClose) /
      snapshot.previousClose) *
    100
  )
}

export function advanceMarketSnapshot(
  snapshot: MarketSnapshot,
  now: Date,
  random = Math.random,
): MarketSnapshot {
  const status = getMarketStatus(now)
  if (status === 'closed') {
    return { ...snapshot, status, updatedAt: now.getTime() }
  }

  const nextPrice = Math.max(
    0.4,
    Math.min(0.55, snapshot.currentPrice + (random() - 0.48) * 0.001),
  )

  return {
    ...snapshot,
    currentPrice: nextPrice,
    high24h: Math.max(snapshot.high24h, nextPrice),
    low24h: Math.min(snapshot.low24h, nextPrice),
    volume24h: snapshot.volume24h + Math.floor(random() * 24) + 4,
    status,
    updatedAt: now.getTime(),
  }
}
