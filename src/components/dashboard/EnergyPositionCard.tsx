import { ArrowDownLeft, ArrowUpRight, Home, Sun } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export interface EnergyPositionCardProps {
  netKwh: number
  generatedKwh: number
  consumedKwh: number
  exportedKwh: number
  importedKwh: number
}

export function EnergyPositionCard({
  netKwh,
  generatedKwh,
  consumedKwh,
  exportedKwh,
  importedKwh,
}: EnergyPositionCardProps) {
  const surplus = netKwh >= 0

  return (
    <Card className="flex-row flex-wrap items-center justify-between gap-6 border-border-subtle bg-bg-surface p-5">
      <div>
        <p className="text-label-md font-medium tracking-wide text-text-tertiary">
          TODAY&apos;S ENERGY POSITION
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span
            className={cn(
              'font-mono text-4xl font-semibold',
              surplus ? 'text-brand-primary' : 'text-destructive',
            )}
          >
            {surplus ? '+' : ''}
            {netKwh.toFixed(1)} kWh
          </span>
          <Badge className="gap-1 bg-brand-primary-muted text-brand-primary">
            <ArrowUpRight className="size-3" />
            {surplus ? 'Surplus' : 'Deficit'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <Sun className="mx-auto mb-1 size-4 text-brand-warning" />
          <p className="font-mono text-xl font-semibold text-text-primary">
            {generatedKwh}
          </p>
          <p className="text-xs text-text-tertiary">Generated</p>
        </div>
        <div className="text-center">
          <Home className="mx-auto mb-1 size-4 text-text-secondary" />
          <p className="font-mono text-xl font-semibold text-text-primary">
            {consumedKwh}
          </p>
          <p className="text-xs text-text-tertiary">Consumed</p>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <span className="flex items-center gap-1 text-brand-primary">
            <ArrowUpRight className="size-3.5" />
            {exportedKwh} kWh Exported
          </span>
          <span className="flex items-center gap-1 text-text-tertiary">
            <ArrowDownLeft className="size-3.5" />
            {importedKwh} kWh Imported
          </span>
        </div>
      </div>
    </Card>
  )
}