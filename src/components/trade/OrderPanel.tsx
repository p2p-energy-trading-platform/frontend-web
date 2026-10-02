import { Info, Wallet, Zap } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'

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
      <Tabs
        value={side}
        onValueChange={(value) => {
          if (value === 'buy' || value === 'sell') setSide(value)
        }}
        className="border-b border-border-subtle"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-none bg-transparent">
          <TabsTrigger value="buy">Buy Energy</TabsTrigger>
          <TabsTrigger value="sell">Sell Energy</TabsTrigger>
        </TabsList>
      </Tabs>
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
          <Tabs
            value={orderType}
            onValueChange={(value) => {
              if (value === 'market' || value === 'limit') setOrderType(value)
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market Order</TabsTrigger>
              <TabsTrigger value="limit">Limit Order</TabsTrigger>
            </TabsList>
          </Tabs>
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
            <Input
              id="amount"
              min="0"
              step="1"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-11 pr-14"
            />
            <span className="absolute right-3 top-3 text-xs text-text-tertiary">
              kWh
            </span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((preset) => (
              <Button
                type="button"
                key={preset}
                variant={amount === String(preset) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAmount(String(preset))}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="price"
            className="mb-2 flex items-center gap-1 text-xs font-medium text-text-secondary"
          >
            Price (RM/kWh){' '}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="About price"
                  />
                }
              >
                <Info />
              </TooltipTrigger>
              <TooltipContent>Price per kilowatt-hour</TooltipContent>
            </Tooltip>
          </label>
          <div className="relative">
            <Input
              id="price"
              min="0"
              step="0.001"
              type={orderType === 'market' ? 'text' : 'number'}
              disabled={orderType === 'market'}
              value={orderType === 'market' ? 'Best market price' : price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-11 pr-20"
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
        <Button
          type="button"
          disabled={!valid}
          variant={side === 'buy' ? 'default' : 'destructive'}
          className="h-11 w-full"
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {valid ? quantity : 0} kWh
        </Button>
        <p className="text-center text-[11px] leading-4 text-text-tertiary">
          Orders are matched with verified participants in your energy zone.
        </p>
      </div>
    </section>
  )
}
