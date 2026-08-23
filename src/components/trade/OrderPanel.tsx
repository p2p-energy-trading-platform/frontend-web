import { Info, Wallet, Zap } from 'lucide-react'
import { useState } from 'react'

import { cn } from '#/lib/utils'

import type { OrderSide, OrderType } from './types'

export function OrderPanel() {
  const availableEnergy = 328.4
  const [side, setSide] = useState<OrderSide>('buy')
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
              onChange={(event) => setAmount(event.target.value)}
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
            Price (RM/kWh) <Info className="size-3 text-text-tertiary" />
          </label>
          <div className="relative">
            <input
              id="price"
              min="0"
              step="0.001"
              type="number"
              disabled={orderType === 'market'}
              value={orderType === 'market' ? 'Best market price' : price}
              onChange={(event) => setPrice(event.target.value)}
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
