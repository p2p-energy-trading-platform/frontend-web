import { useState, useMemo } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { toast } from '#/components/ui/toast'
import { useOrders } from '#/hooks/useHistory'
import type {
  HistoryViewState,
  OrderRecord,
  OrderStatus,
  TradeSide,
} from '#/components/history/types'

const PAGE_SIZE = 8

// ─── Status badges ────────────────────────────────────────────────────────────

const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  open: {
    label: 'Open',
    cls: 'bg-feedback-info-background text-feedback-info-icon border-feedback-info-border',
  },
  pending: {
    label: 'Pending',
    cls: 'bg-feedback-warning-background text-feedback-warning-icon border-feedback-warning-border',
  },
  partial: {
    label: 'Partial',
    cls: 'bg-feedback-success-background text-feedback-success-icon border-feedback-success-border',
  },
  filled: {
    label: 'Filled',
    cls: 'bg-feedback-success-background text-feedback-success-icon border-feedback-success-border',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'bg-secondary text-text-secondary border-border',
  },
  expired: {
    label: 'Expired',
    cls: 'bg-secondary text-text-secondary border-border',
  },
  rejected: {
    label: 'Rejected',
    cls: 'bg-feedback-error-background text-feedback-error-icon border-feedback-error-border',
  },
}

function StatusPill({ label, cls }: { label: string; cls: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption font-semibold border ${cls}`}
    >
      {label}
    </span>
  )
}
function SidePill({ side }: { side: TradeSide }) {
  return side === 'sell' ? (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-caption font-bold bg-trade-sell-background text-trade-sell-text">
      <ArrowUpRight size={9} />
      Sell
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-caption font-bold bg-trade-buy-background text-trade-buy-text">
      <ArrowDownLeft size={9} />
      Buy
    </span>
  )
}

// ─── Order detail drawer ──────────────────────────────────────────────────────

function OrderDrawer({
  order,
  onClose,
  onCancel,
}: {
  order: OrderRecord
  onClose: () => void
  onCancel: (id: string) => void
}) {
  const { limitPriceLabel } = useOrders()
  const st = ORDER_STATUS[order.status]
  const fillPct =
    order.requestedQty > 0 ? (order.filledQty / order.requestedQty) * 100 : 0
  const canCancel = order.status === 'open' || order.status === 'partial'
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            {order.id}
            <StatusPill {...st} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SidePill side={order.side} />
            <span className="text-xs text-text-secondary uppercase tracking-wide font-semibold">
              {order.type}
            </span>
            <span className="text-sm text-text-secondary">{order.slot}</span>
          </div>
          <div className="bg-secondary rounded-xl border border-border divide-y divide-border text-sm">
            {[
              ['Submitted', order.submittedAt],
              ['Requested qty', `${order.requestedQty} kWh`],
              ['Filled qty', `${order.filledQty} kWh`],
              ['Limit price', limitPriceLabel(order.limitPrice)],
              ...(order.closedAt ? [['Closed', order.closedAt]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5">
                <span className="text-text-secondary">{k}</span>
                <span className="font-semibold font-mono text-foreground">
                  {v}
                </span>
              </div>
            ))}
          </div>
          {/* Fill progress */}
          <div>
            <div className="flex justify-between text-xs text-text-tertiary mb-1.5">
              <span>Fill progress</span>
              <span className="font-mono font-semibold text-foreground">
                {fillPct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                onCancel(order.id)
                onClose()
              }}
            >
              Cancel order
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Orders tab ───────────────────────────────────────────────────────────────

export function OrdersTab({ state }: { state: HistoryViewState }) {
  const { orders: seedOrders, source } = useOrders()
  const [query, setQuery] = useState('')
  const [sideF, setSideF] = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<OrderRecord | null>(null)
  const [orders, setOrders] = useState(seedOrders)

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (sideF !== 'all' && o.side !== sideF) return false
        if (statusF !== 'all' && o.status !== statusF) return false
        if (query) {
          const q = query.toLowerCase()
          return o.id.toLowerCase().includes(q) || o.slot.includes(q)
        }
        return true
      }),
    [query, sideF, statusF, orders],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function cancelOrder(id: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              closedAt: 'Now',
            }
          : o,
      ),
    )

    toast.add({
      type: 'success',
      title: `Order ${id} cancelled.`,
    })
  }

  if (state === 'loading')
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    )
  if (state === 'error')
    return (
      <EmptyState
        icon={XCircle}
        title="Failed to load orders"
        description="Order history could not be retrieved."
        action={
          <Button variant="secondary" size="sm">
            <RefreshCw size={12} />
            Retry
          </Button>
        }
      />
    )
  if (state === 'empty')
    return (
      <EmptyState
        icon={FileText}
        title="No orders yet"
        description="Orders you place will appear here. Head to the Trade terminal to get started."
      />
    )

  return (
    <div className="space-y-3" data-source={source}>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[160px] flex-1">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search order ID or slot…"
            aria-label="Search orders"
            className="bg-background pl-8"
          />
        </div>
        <FilterSelect
          label="Filter by side"
          value={sideF}
          onValueChange={(value) => {
            setSideF(value)
            setPage(1)
          }}
          options={[
            { v: 'all', l: 'All sides' },
            { v: 'sell', l: 'Sell' },
            { v: 'buy', l: 'Buy' },
          ]}
        />
        <FilterSelect
          label="Filter by status"
          value={statusF}
          onValueChange={(value) => {
            setStatusF(value)
            setPage(1)
          }}
          options={[
            { v: 'all', l: 'All status' },
            { v: 'open', l: 'Open' },
            { v: 'partial', l: 'Partial' },
            { v: 'filled', l: 'Filled' },
            { v: 'cancelled', l: 'Cancelled' },
            { v: 'expired', l: 'Expired' },
            { v: 'rejected', l: 'Rejected' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No results"
          description="Adjust your filters."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-border bg-secondary/60 hover:bg-secondary/60">
                  {[
                    'Submitted',
                    'ID',
                    'Side',
                    'Type',
                    'Req. qty',
                    'Filled',
                    'Limit price',
                    'Slot',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="px-3 py-2.5 text-left font-semibold tracking-wide whitespace-nowrap text-text-tertiary uppercase"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((o) => {
                  const canCancel =
                    o.status === 'open' || o.status === 'partial'
                  return (
                    <TableRow key={o.id} className="border-border">
                      <TableCell className="px-3 py-3 whitespace-nowrap text-text-secondary">
                        {o.submittedAt}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono font-semibold text-foreground">
                        {o.id}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <SidePill side={o.side} />
                      </TableCell>
                      <TableCell className="px-3 py-3 font-medium text-text-primary capitalize">
                        {o.type}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono text-foreground">
                        {o.requestedQty}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono text-foreground">
                        {o.filledQty}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono text-foreground">
                        {o.limitPrice ? (
                          o.limitPrice.toFixed(3)
                        ) : (
                          <span className="text-text-tertiary">Market</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono whitespace-nowrap text-text-primary">
                        {o.slot}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <StatusPill {...ORDER_STATUS[o.status]} />
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`View order ${o.id}`}
                            onClick={() => setSelected(o)}
                          >
                            <Eye />
                          </Button>
                          {canCancel && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Cancel order ${o.id}`}
                              onClick={() => cancelOrder(o.id)}
                            >
                              <XCircle />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paged.map((o) => (
              <div
                key={o.id}
                className="bg-card rounded-xl border border-border p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SidePill side={o.side} />
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {o.id}
                    </span>
                    <span className="text-xs text-text-tertiary capitalize">
                      {o.type}
                    </span>
                  </div>
                  <StatusPill {...ORDER_STATUS[o.status]} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">
                    {o.slot} · {o.submittedAt}
                  </span>
                  <span className="font-mono text-foreground">
                    {o.filledQty}/{o.requestedQty} kWh
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelected(o)}
                  >
                    <Eye />
                    View
                  </Button>
                  {(o.status === 'open' || o.status === 'partial') && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => cancelOrder(o.id)}
                    >
                      <XCircle />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-text-tertiary">
              {filtered.length} order{filtered.length !== 1 ? 's' : ''} · page{' '}
              {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onCancel={cancelOrder}
        />
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ v: string; l: string }>
}) {
  const selected = options.find((option) => option.v === value)

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next)
      }}
    >
      <SelectTrigger aria-label={label}>
        <SelectValue>{selected?.l}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.v} value={option.v}>
              {option.l}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
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
