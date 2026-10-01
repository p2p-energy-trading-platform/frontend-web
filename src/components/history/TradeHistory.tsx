import { useState, useMemo } from 'react'
import { Button } from '#/components/ui/button'
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  XCircle,
  Eye,
  BarChart2,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { toast } from 'sonner'

type TradeStatus = 'settled' | 'pending' | 'failed'
type TradeSide = 'buy' | 'sell'
type HistoryDemoState = 'populated' | 'loading' | 'error' | 'empty'

interface TradeRecord {
  id: string
  executedAt: string
  side: TradeSide
  slot: string
  kWh: number
  basePrice: number
  gridFee: number
  effectivePrice: number
  totalAed: number
  zone: string
  status: TradeStatus
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const TRADES: TradeRecord[] = [
  {
    id: 'GX-2847',
    executedAt: '17 Jul · 14:32',
    side: 'sell',
    slot: '14:00–14:30',
    kWh: 8.4,
    basePrice: 0.38,
    gridFee: 0.09,
    effectivePrice: 0.38,
    totalAed: 3.192,
    zone: 'Participant · Dubai South',
    status: 'settled',
  },
  {
    id: 'GX-2846',
    executedAt: '17 Jul · 13:15',
    side: 'buy',
    slot: '13:00–13:30',
    kWh: 5.2,
    basePrice: 0.41,
    gridFee: 0.09,
    effectivePrice: 0.41,
    totalAed: 2.132,
    zone: 'Participant · JLT Zone 3',
    status: 'settled',
  },
  {
    id: 'GX-2845',
    executedAt: '17 Jul · 11:50',
    side: 'sell',
    slot: '12:00–12:30',
    kWh: 12.0,
    basePrice: 0.36,
    gridFee: 0.09,
    effectivePrice: 0.36,
    totalAed: 4.32,
    zone: 'Participant · Business Bay',
    status: 'pending',
  },
  {
    id: 'GX-2844',
    executedAt: '16 Jul · 10:22',
    side: 'buy',
    slot: '10:00–10:30',
    kWh: 3.8,
    basePrice: 0.43,
    gridFee: 0.09,
    effectivePrice: 0.43,
    totalAed: 1.634,
    zone: 'Participant · Jumeirah',
    status: 'settled',
  },
  {
    id: 'GX-2843',
    executedAt: '15 Jul · 09:05',
    side: 'sell',
    slot: '09:00–09:30',
    kWh: 9.6,
    basePrice: 0.37,
    gridFee: 0.09,
    effectivePrice: 0.37,
    totalAed: 3.552,
    zone: 'Participant · Al Quoz',
    status: 'failed',
  },
  {
    id: 'GX-2831',
    executedAt: '14 Jul · 15:40',
    side: 'sell',
    slot: '15:30–16:00',
    kWh: 11.2,
    basePrice: 0.385,
    gridFee: 0.09,
    effectivePrice: 0.385,
    totalAed: 4.312,
    zone: 'Participant · Downtown',
    status: 'settled',
  },
  {
    id: 'GX-2822',
    executedAt: '13 Jul · 12:18',
    side: 'buy',
    slot: '12:00–12:30',
    kWh: 6.4,
    basePrice: 0.395,
    gridFee: 0.09,
    effectivePrice: 0.395,
    totalAed: 2.528,
    zone: 'Participant · DIFC',
    status: 'settled',
  },
  {
    id: 'GX-2811',
    executedAt: '12 Jul · 08:45',
    side: 'sell',
    slot: '08:30–09:00',
    kWh: 7.8,
    basePrice: 0.342,
    gridFee: 0.09,
    effectivePrice: 0.342,
    totalAed: 2.668,
    zone: 'Participant · Deira',
    status: 'settled',
  },
  {
    id: 'GX-2798',
    executedAt: '11 Jul · 16:02',
    side: 'sell',
    slot: '16:00–16:30',
    kWh: 9.6,
    basePrice: 0.37,
    gridFee: 0.09,
    effectivePrice: 0.37,
    totalAed: 3.552,
    zone: 'Participant · Al Quoz',
    status: 'settled',
  },
  {
    id: 'GX-2784',
    executedAt: '10 Jul · 11:30',
    side: 'buy',
    slot: '11:00–11:30',
    kWh: 4.2,
    basePrice: 0.42,
    gridFee: 0.09,
    effectivePrice: 0.42,
    totalAed: 1.764,
    zone: 'Participant · Marina',
    status: 'settled',
  },
  {
    id: 'GX-2771',
    executedAt: '09 Jul · 13:55',
    side: 'sell',
    slot: '13:30–14:00',
    kWh: 15.0,
    basePrice: 0.368,
    gridFee: 0.09,
    effectivePrice: 0.368,
    totalAed: 5.52,
    zone: 'Participant · Yas Island',
    status: 'settled',
  },
  {
    id: 'GX-2760',
    executedAt: '08 Jul · 10:10',
    side: 'buy',
    slot: '10:00–10:30',
    kWh: 2.8,
    basePrice: 0.44,
    gridFee: 0.09,
    effectivePrice: 0.44,
    totalAed: 1.232,
    zone: 'Participant · Saadiyat',
    status: 'failed',
  },
]

const PAGE_SIZE = 8

// ─── Status badges ────────────────────────────────────────────────────────────

const TRADE_STATUS: Record<
  TradeStatus,
  { label: string; cls: string; dot: string }
> = {
  settled: {
    label: 'Settled',
    cls: 'bg-feedback-success-background text-feedback-success-icon border-feedback-success-border',
    dot: 'bg-feedback-success-icon',
  },
  pending: {
    label: 'Pending',
    cls: 'bg-feedback-warning-background text-feedback-warning-icon border-feedback-warning-border',
    dot: 'bg-feedback-warning-icon',
  },
  failed: {
    label: 'Failed',
    cls: 'bg-feedback-error-background text-feedback-error-icon border-feedback-error-border',
    dot: 'bg-feedback-error-icon',
  },
}

function StatusPill({ label, cls }: { label: string; cls: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}
    >
      {label}
    </span>
  )
}
function SidePill({ side }: { side: TradeSide }) {
  return side === 'sell' ? (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-trade-sell-background text-trade-sell-text">
      <ArrowUpRight size={9} />
      Sell
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-trade-buy-background text-trade-buy-text">
      <ArrowDownLeft size={9} />
      Buy
    </span>
  )
}

// ─── Trade detail drawer ──────────────────────────────────────────────────────

function TradeDrawer({
  trade,
  onClose,
}: {
  trade: TradeRecord
  onClose: () => void
}) {
  const st = TRADE_STATUS[trade.status]
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground font-mono">
              {trade.id}
            </span>
            <StatusPill {...st} />
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-foreground transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <SidePill side={trade.side} />
            <span className="text-sm text-text-secondary">
              {trade.slot} · {trade.executedAt}
            </span>
          </div>
          <div className="bg-secondary rounded-xl border border-border divide-y divide-border text-sm">
            {[
              ['Energy', `${trade.kWh} kWh`],
              ['Base price', `AED ${trade.basePrice.toFixed(3)}/kWh`],
              ['Grid fee', `AED ${trade.gridFee.toFixed(3)}/kWh`],
              ['Effective price', `AED ${trade.effectivePrice.toFixed(3)}/kWh`],
              ['Total', `AED ${trade.totalAed.toFixed(3)}`],
              ['Counterparty', trade.zone],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5">
                <span className="text-text-secondary">{k}</span>
                <span
                  className={`font-semibold font-mono text-foreground ${k === 'Total' ? 'text-accent' : ''}`}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-tertiary flex items-start gap-1.5">
            <AlertCircle size={11} className="shrink-0 mt-0.5" />
            Counterparty identity is anonymised per GridX trading rules. Grid
            fee (AED 0.090/kWh) covers metering, settlement, and grid
            infrastructure.
          </p>
          {trade.status !== 'failed' && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                toast.success('Receipt downloaded.')
                onClose()
              }}
            >
              <Download size={12} />
              Download receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Trades tab ───────────────────────────────────────────────────────────────

export function TradesTab({ state }: { state: HistoryDemoState }) {
  const [query, setQuery] = useState('')
  const [sideF, setSideF] = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<TradeRecord | null>(null)

  const filtered = useMemo(() => {
    return TRADES.filter((t) => {
      if (sideF !== 'all' && t.side !== sideF) return false
      if (statusF !== 'all' && t.status !== statusF) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          t.id.toLowerCase().includes(q) ||
          t.zone.toLowerCase().includes(q) ||
          t.slot.includes(q)
        )
      }
      return true
    })
  }, [query, sideF, statusF])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (state === 'loading')
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    )
  if (state === 'error')
    return (
      <EmptyState
        icon={XCircle}
        title="Failed to load trades"
        description="Trade history could not be retrieved. Try again."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.info('Retrying…')}
          >
            <RefreshCw size={12} />
            Retry
          </Button>
        }
      />
    )
  if (state === 'empty')
    return (
      <EmptyState
        icon={BarChart2}
        title="No trades yet"
        description="Your executed trades will appear here once you have placed and matched orders on the GridX market."
      />
    )

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search ID, zone, slot…"
            className="w-full bg-background pl-8 pr-3 py-2 text-sm text-text-primary border border-input rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
          />
        </div>
        {[
          {
            val: sideF,
            set: (v: string) => {
              setSideF(v)
              setPage(1)
            },
            opts: [
              { v: 'all', l: 'All sides' },
              { v: 'sell', l: 'Sell' },
              { v: 'buy', l: 'Buy' },
            ],
          },
          {
            val: statusF,
            set: (v: string) => {
              setStatusF(v)
              setPage(1)
            },
            opts: [
              { v: 'all', l: 'All status' },
              { v: 'settled', l: 'Settled' },
              { v: 'pending', l: 'Pending' },
              { v: 'failed', l: 'Failed' },
            ],
          },
        ].map((f, fi) => (
          <div key={fi} className="relative">
            <select
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              className="appearance-none bg-background pl-3 pr-8 py-2 text-sm text-text-primary border border-input rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 cursor-pointer"
            >
              {f.opts.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
          </div>
        ))}
        <button
          onClick={() => toast.success('CSV export started.')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-text-secondary hover:text-foreground hover:bg-secondary transition-all font-medium"
        >
          <Download size={13} />
          Export
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No results"
          description="Adjust your filters or search term."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    {[
                      'Time',
                      'ID',
                      'Side',
                      'Slot',
                      'Energy',
                      'Base',
                      'Fee',
                      'Eff. price',
                      'Total',
                      'Zone',
                      'Status',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left font-semibold text-text-tertiary uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paged.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-3 py-3 text-text-secondary whitespace-nowrap">
                        {t.executedAt}
                      </td>
                      <td className="px-3 py-3 font-mono font-semibold text-foreground">
                        {t.id}
                      </td>
                      <td className="px-3 py-3">
                        <SidePill side={t.side} />
                      </td>
                      <td className="px-3 py-3 font-mono text-text-primary whitespace-nowrap">
                        {t.slot}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        {t.kWh}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        {t.basePrice.toFixed(3)}
                      </td>
                      <td className="px-3 py-3 font-mono text-text-secondary">
                        {t.gridFee.toFixed(3)}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        {t.effectivePrice.toFixed(3)}
                      </td>
                      <td className="px-3 py-3 font-mono font-semibold text-foreground">
                        {t.totalAed.toFixed(3)}
                      </td>
                      <td className="px-3 py-3 text-text-secondary max-w-[120px] truncate">
                        {t.zone}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill {...TRADE_STATUS[t.status]} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setSelected(t)}
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-foreground hover:bg-secondary transition-all"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paged.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="w-full bg-card rounded-xl border border-border p-4 text-left shadow-sm hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SidePill side={t.side} />
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {t.id}
                    </span>
                  </div>
                  <StatusPill {...TRADE_STATUS[t.status]} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">
                    {t.slot} · {t.executedAt}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    AED {t.totalAed.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-text-tertiary">
                    {t.kWh} kWh · AED {t.effectivePrice.toFixed(3)}/kWh
                  </span>
                  <span className="text-text-tertiary truncate max-w-[120px]">
                    {t.zone}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-text-tertiary">
              {filtered.length} trade{filtered.length !== 1 ? 's' : ''} · page{' '}
              {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-border text-text-tertiary hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-border text-text-tertiary hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
      {selected && (
        <TradeDrawer trade={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

{
  /* TODO: Need to check */
}
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg bg-muted ${className}`} />
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={22} className="text-text-tertiary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-xs mb-5">{description}</p>
      {action}
    </div>
  )
}
