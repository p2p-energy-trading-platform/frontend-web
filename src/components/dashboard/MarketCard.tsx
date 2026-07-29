import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'

export interface MarketTrader {
  name: string
  detail: string
  price: string
}

export function MarketCard({
  listingCount,
  bestBuyPrice,
  sellFloorPrice,
  demandZone,
  traderCount,
  traders,
  onBrowseAll,
}: {
  listingCount: number
  bestBuyPrice: string
  sellFloorPrice: string
  demandZone: string
  traderCount: number
  traders: Array<MarketTrader>
  onBrowseAll?: () => void
}) {
  return (
    <Card className="gap-3 border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">JLT market</h3>
        <Badge
          variant="outline"
          className="border-border-subtle text-text-tertiary"
        >
          {listingCount} listings
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-brand-primary-muted p-3">
          <p className="font-mono text-lg font-semibold text-brand-primary">
            {bestBuyPrice}
            <span className="text-xs font-normal">/kWh</span>
          </p>
          <p className="text-xs text-text-tertiary">Best buy</p>
        </div>
        <div className="rounded-lg bg-brand-primary-muted p-3">
          <p className="font-mono text-lg font-semibold text-brand-primary">
            {sellFloorPrice}
            <span className="text-xs font-normal">/kWh</span>
          </p>
          <p className="text-xs text-text-tertiary">Sell floor</p>
        </div>
        <div className="rounded-lg bg-brand-warning-muted p-3">
          <p className="text-sm font-semibold text-brand-warning">
            High <span className="text-xs font-normal">{demandZone}</span>
          </p>
          <p className="text-xs text-text-tertiary">Demand</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-3">
          <p className="text-sm font-semibold text-text-primary">
            {traderCount} <span className="text-xs font-normal">active</span>
          </p>
          <p className="text-xs text-text-tertiary">Traders</p>
        </div>
      </div>

      <div className="divide-y divide-border-subtle">
        {traders.map((trader) => (
          <div
            key={trader.name}
            className="flex items-center justify-between py-2.5 text-sm"
          >
            <div>
              <p className="font-medium text-text-primary">{trader.name}</p>
              <p className="text-xs text-text-tertiary">{trader.detail}</p>
            </div>
            <p className="font-mono text-text-primary">
              {trader.price}
              <span className="ml-1 text-xs text-text-tertiary">AED/kWh</span>
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onBrowseAll}
        className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-brand-primary/90"
      >
        Browse all listings
      </button>
    </Card>
  )
}
