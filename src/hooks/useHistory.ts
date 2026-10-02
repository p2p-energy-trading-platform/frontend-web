import {
  limitPriceLabel,
  orderRecords,
  presentedTrades,
  tradeSettlementNote,
} from '#/data/history'

export function useOrders() {
  return {
    source: 'demo' as const,
    orders: orderRecords,
    limitPriceLabel,
  }
}

export function useTrades() {
  return {
    source: 'demo' as const,
    trades: presentedTrades,
    settlementNote: tradeSettlementNote,
  }
}
