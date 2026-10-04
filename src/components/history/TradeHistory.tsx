import { useState, useMemo } from 'react';
import { Alert, AlertDescription } from '#/components/ui/alert';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Skeleton } from '#/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { toast } from '#/components/ui/toast';
import { useTrades } from '#/hooks/useHistory';
import type {
  HistoryViewState,
  PresentedTrade,
  TradeStatus,
} from '#/components/history/types';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  Eye,
  BarChart2,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { EmptyState } from '../ui/empty-state';
import { Badge } from '../ui/badge';
import { FilterSelect, SidePill } from './HistoryComponents';

const PAGE_SIZE = 8;

// ─── Status badges ────────────────────────────────────────────────────────────

const TRADE_STATUS: Record<TradeStatus, { label: string }> = {
  settled: {
    label: 'Settled',
  },
  pending: {
    label: 'Pending',
  },
  failed: {
    label: 'Failed',
  },
};

// ─── Trade detail drawer ──────────────────────────────────────────────────────

function TradeDrawer({
  trade,
  onClose,
}: {
  trade: PresentedTrade;
  onClose: () => void;
}) {
  const { settlementNote } = useTrades();
  const st = TRADE_STATUS[trade.status];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            {trade.id}
            <Badge>{st.label}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SidePill side={trade.side} />
            <span className="text-sm text-text-secondary">
              {trade.slot} · {trade.executedAt}
            </span>
          </div>
          <div className="bg-secondary rounded-xl border border-border divide-y divide-border text-sm">
            {[
              ['Energy', `${trade.kWh} kWh`],
              ['Base price', trade.basePriceLabel],
              ['Grid fee', trade.gridFeeLabel],
              ['Effective price', trade.effectivePriceLabel],
              ['Total', trade.totalLabel],
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
          <Alert>
            <AlertCircle />
            <AlertDescription>{settlementNote}</AlertDescription>
          </Alert>
          {trade.status !== 'failed' && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                toast.add({
                  type: 'success',
                  title: 'Receipt downloaded.',
                });
                onClose();
              }}
            >
              <Download size={12} />
              Download receipt
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Trades tab ───────────────────────────────────────────────────────────────

export function TradesTab({ state }: { state: HistoryViewState }) {
  const { trades: TRADES, source } = useTrades();
  const [query, setQuery] = useState('');
  const [sideF, setSideF] = useState('all');
  const [statusF, setStatusF] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PresentedTrade | null>(null);

  const filtered = useMemo(() => {
    return TRADES.filter((t) => {
      if (sideF !== 'all' && t.side !== sideF) return false;
      if (statusF !== 'all' && t.status !== statusF) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.zone.toLowerCase().includes(q) ||
          t.slot.includes(q)
        );
      }
      return true;
    });
  }, [query, sideF, statusF, TRADES]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (state === 'loading')
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
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
            onClick={() => toast.add({ type: 'info', title: 'Retrying…' })}
          >
            <RefreshCw size={12} />
            Retry
          </Button>
        }
      />
    );
  if (state === 'empty')
    return (
      <EmptyState
        icon={BarChart2}
        title="No trades yet"
        description="Your executed trades will appear here once you have placed and matched orders on the GridX market."
      />
    );

  return (
    <div className="space-y-3" data-source={source}>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-40 flex-1">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search ID, zone, slot…"
            aria-label="Search trades"
            className="bg-background pl-8"
          />
        </div>
        <FilterSelect
          label="Filter by side"
          value={sideF}
          onValueChange={(value) => {
            setSideF(value);
            setPage(1);
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
            setStatusF(value);
            setPage(1);
          }}
          options={[
            { v: 'all', l: 'All status' },
            { v: 'settled', l: 'Settled' },
            { v: 'pending', l: 'Pending' },
            { v: 'failed', l: 'Failed' },
          ]}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast.add({ type: 'success', title: 'CSV export started.' })
          }
        >
          <Download />
          Export
        </Button>
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
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-border bg-secondary/60 hover:bg-secondary/60">
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
                    <TableHead
                      key={h || 'actions'}
                      className="px-3 py-2.5 text-left font-semibold tracking-wide whitespace-nowrap text-text-tertiary uppercase"
                    >
                      {h || 'Actions'}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((t) => (
                  <TableRow key={t.id} className="border-border">
                    <TableCell className="px-3 py-3 whitespace-nowrap text-text-secondary">
                      {t.executedAt}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono font-semibold text-foreground">
                      {t.id}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <SidePill side={t.side} />
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono whitespace-nowrap text-text-primary">
                      {t.slot}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono text-foreground">
                      {t.kWh}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono text-foreground">
                      {t.basePrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono text-text-secondary">
                      {t.gridFee.toFixed(3)}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono text-foreground">
                      {t.effectivePrice.toFixed(3)}
                    </TableCell>
                    <TableCell className="px-3 py-3 font-mono font-semibold text-foreground">
                      {t.totalAed.toFixed(3)}
                    </TableCell>
                    <TableCell className="max-w-30 truncate px-3 py-3 text-text-secondary">
                      {t.zone}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge>{TRADE_STATUS[t.status].label}</Badge>
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`View trade ${t.id}`}
                        onClick={() => setSelected(t)}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <Badge>{TRADE_STATUS[t.status].label}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">
                    {t.slot} · {t.executedAt}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {t.totalLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-text-tertiary">
                    {t.kWh} kWh · {t.effectivePriceLabel}
                  </span>
                  <span className="text-text-tertiary truncate max-w-30">
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
        <TradeDrawer trade={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
