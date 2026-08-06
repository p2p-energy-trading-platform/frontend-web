import { ChevronLeft, ChevronRight, Calendar, Download, MapPin } from 'lucide-react'

import { cn } from '#/lib/utils'

export type EnergyPeriod = 'Day' | 'Week' | 'Month' | 'Custom'

export interface EnergyDateBarProps {
  period: EnergyPeriod
  onPeriodChange: (period: EnergyPeriod) => void
  dateLabel: string
  onPrevDate?: () => void
  onNextDate?: () => void
  zoneLabel: string
  onExportCsv?: () => void
}

const PERIODS: Array<EnergyPeriod> = ['Day', 'Week', 'Month', 'Custom']

export function EnergyDateBar({
  period,
  onPeriodChange,
  dateLabel,
  onPrevDate,
  onNextDate,
  zoneLabel,
  onExportCsv,
}: EnergyDateBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-4">
        {/* Period toggle */}
        <div className="inline-flex rounded-lg border border-border-subtle bg-bg-elevated p-0.5 text-sm font-medium">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={cn(
                'rounded-md px-3 py-1 transition',
                p === period
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Date navigator */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevDate}
            aria-label="Previous"
            className="flex size-7 items-center justify-center rounded-md text-text-tertiary transition hover:bg-bg-elevated hover:text-text-primary"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-text-primary">
            <Calendar className="size-3.5 text-text-tertiary" />
            {dateLabel}
          </span>
          <button
            type="button"
            onClick={onNextDate}
            aria-label="Next"
            className="flex size-7 items-center justify-center rounded-md text-text-tertiary transition hover:bg-bg-elevated hover:text-text-primary"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Zone */}
        <span className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-secondary">
          <MapPin className="size-3" />
          {zoneLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onExportCsv}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-1.5 text-sm font-medium text-text-primary transition hover:bg-bg-overlay"
      >
        <Download className="size-3.5" />
        Export CSV
      </button>
    </div>
  )
}