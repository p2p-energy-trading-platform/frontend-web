export const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D'] as const

export type Timeframe = (typeof timeframes)[number]
export type OrderSide = 'buy' | 'sell'
export type OrderType = 'market' | 'limit'
