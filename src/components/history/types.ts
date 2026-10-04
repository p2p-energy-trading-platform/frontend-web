export type OrderStatus =
  | 'open'
  | 'partial'
  | 'filled'
  | 'cancelled'
  | 'expired'
  | 'pending'
  | 'rejected';

export type TradeStatus = 'settled' | 'pending' | 'failed';
export type TradeSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type HistoryViewState = 'populated' | 'loading' | 'error' | 'empty';

export interface OrderRecord {
  id: string;
  submittedAt: string;
  side: TradeSide;
  type: OrderType;
  requestedQty: number;
  filledQty: number;
  limitPrice?: number;
  slot: string;
  status: OrderStatus;
  closedAt?: string;
}

export interface TradeRecord {
  id: string;
  executedAt: string;
  side: TradeSide;
  slot: string;
  kWh: number;
  basePrice: number;
  gridFee: number;
  effectivePrice: number;
  totalAed: number;
  zone: string;
  status: TradeStatus;
}

export interface PresentedTrade extends TradeRecord {
  totalLabel: string;
  effectivePriceLabel: string;
  basePriceLabel: string;
  gridFeeLabel: string;
}
