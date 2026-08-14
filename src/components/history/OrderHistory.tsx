import { useState, useMemo } from "react"; 
import { Button } from '#/components/ui/button' 
import { Search, FileText, Download, ChevronDown, ChevronLeft, ChevronRight, X, AlertCircle, XCircle, Eye, BarChart2, Filter, RefreshCw, ArrowUpRight, ArrowDownLeft } from "lucide-react"; 
import { toast } from "sonner"; 
 
 
type TradeStatus = "settled" | "pending" | "failed"; 
type OrderStatus = "open" | "partial" | "filled" | "cancelled" | "expired" | "pending" | "rejected"; 
type TradeSide   = "buy" | "sell"; 
type OrderType   = "market" | "limit"; 
type HistoryTab  = "trades" | "orders" | "statements"; 
type HistoryDemoState = "populated" | "loading" | "error" | "empty"; 
 
interface TradeRecord { 
  id: string; executedAt: string; side: TradeSide; slot: string; 
  kWh: number; basePrice: number; gridFee: number; effectivePrice: number; 
  totalAed: number; zone: string; status: TradeStatus; 
} 
interface OrderRecord { 
  id: string; submittedAt: string; side: TradeSide; type: OrderType; 
  requestedQty: number; filledQty: number; limitPrice?: number; 
  slot: string; status: OrderStatus; closedAt?: string; 
} 
 
// ─── Sample data ───────────────────────────────────────────────────────────── 
 
const TRADES: TradeRecord[] = [ 
  { id:"GX-2847", executedAt:"17 Jul · 14:32", side:"sell", slot:"14:00–14:30", kWh:8.4,  basePrice:0.380, gridFee:0.090, effectivePrice:0.380, totalAed:3.192, zone:"Participant · Dubai South", status:"settled"  }, 
  { id:"GX-2846", executedAt:"17 Jul · 13:15", side:"buy",  slot:"13:00–13:30", kWh:5.2,  basePrice:0.410, gridFee:0.090, effectivePrice:0.410, totalAed:2.132, zone:"Participant · JLT Zone 3", status:"settled"  }, 
  { id:"GX-2845", executedAt:"17 Jul · 11:50", side:"sell", slot:"12:00–12:30", kWh:12.0, basePrice:0.360, gridFee:0.090, effectivePrice:0.360, totalAed:4.320, zone:"Participant · Business Bay", status:"pending"  }, 
  { id:"GX-2844", executedAt:"16 Jul · 10:22", side:"buy",  slot:"10:00–10:30", kWh:3.8,  basePrice:0.430, gridFee:0.090, effectivePrice:0.430, totalAed:1.634, zone:"Participant · Jumeirah", status:"settled"  }, 
  { id:"GX-2843", executedAt:"15 Jul · 09:05", side:"sell", slot:"09:00–09:30", kWh:9.6,  basePrice:0.370, gridFee:0.090, effectivePrice:0.370, totalAed:3.552, zone:"Participant · Al Quoz", status:"failed"   }, 
  { id:"GX-2831", executedAt:"14 Jul · 15:40", side:"sell", slot:"15:30–16:00", kWh:11.2, basePrice:0.385, gridFee:0.090, effectivePrice:0.385, totalAed:4.312, zone:"Participant · Downtown", status:"settled"  }, 
  { id:"GX-2822", executedAt:"13 Jul · 12:18", side:"buy",  slot:"12:00–12:30", kWh:6.4,  basePrice:0.395, gridFee:0.090, effectivePrice:0.395, totalAed:2.528, zone:"Participant · DIFC", status:"settled"  }, 
  { id:"GX-2811", executedAt:"12 Jul · 08:45", side:"sell", slot:"08:30–09:00", kWh:7.8,  basePrice:0.342, gridFee:0.090, effectivePrice:0.342, totalAed:2.668, zone:"Participant · Deira", status:"settled"  }, 
  { id:"GX-2798", executedAt:"11 Jul · 16:02", side:"sell", slot:"16:00–16:30", kWh:9.6,  basePrice:0.370, gridFee:0.090, effectivePrice:0.370, totalAed:3.552, zone:"Participant · Al Quoz", status:"settled"  }, 
  { id:"GX-2784", executedAt:"10 Jul · 11:30", side:"buy",  slot:"11:00–11:30", kWh:4.2,  basePrice:0.420, gridFee:0.090, effectivePrice:0.420, totalAed:1.764, zone:"Participant · Marina", status:"settled"  }, 
  { id:"GX-2771", executedAt:"09 Jul · 13:55", side:"sell", slot:"13:30–14:00", kWh:15.0, basePrice:0.368, gridFee:0.090, effectivePrice:0.368, totalAed:5.520, zone:"Participant · Yas Island", status:"settled"  }, 
  { id:"GX-2760", executedAt:"08 Jul · 10:10", side:"buy",  slot:"10:00–10:30", kWh:2.8,  basePrice:0.440, gridFee:0.090, effectivePrice:0.440, totalAed:1.232, zone:"Participant · Saadiyat", status:"failed"   }, 
]; 
 
const ORDERS: OrderRecord[] = [ 
  { id:"GX-2847", submittedAt:"17 Jul · 14:28", side:"sell", type:"limit",  requestedQty:8.4,  filledQty:8.4,  limitPrice:0.380, slot:"14:00–14:30", status:"filled",    closedAt:"17 Jul · 14:32" }, 
  { id:"GX-2848", submittedAt:"17 Jul · 14:30", side:"buy",  type:"limit",  requestedQty:6.0,  filledQty:2.1,  limitPrice:0.370, slot:"15:00–15:30", status:"partial"                              }, 
  { id:"GX-2849", submittedAt:"17 Jul · 14:31", side:"buy",  type:"limit",  requestedQty:8.0,  filledQty:0,    limitPrice:0.360, slot:"15:00–15:30", status:"open"                                 }, 
  { id:"GX-2846", submittedAt:"17 Jul · 13:10", side:"buy",  type:"market", requestedQty:5.2,  filledQty:5.2,  slot:"13:00–13:30", status:"filled",    closedAt:"17 Jul · 13:15" }, 
  { id:"GX-2845", submittedAt:"17 Jul · 11:45", side:"sell", type:"limit",  requestedQty:12.0, filledQty:0,    limitPrice:0.360, slot:"12:00–12:30", status:"pending"                              }, 
  { id:"GX-2840", submittedAt:"16 Jul · 09:00", side:"sell", type:"limit",  requestedQty:10.0, filledQty:0,    limitPrice:0.410, slot:"09:00–09:30", status:"expired",   closedAt:"16 Jul · 09:30" }, 
  { id:"GX-2835", submittedAt:"15 Jul · 08:55", side:"buy",  type:"limit",  requestedQty:5.0,  filledQty:0,    limitPrice:0.450, slot:"09:00–09:30", status:"cancelled",  closedAt:"15 Jul · 09:05" }, 
  { id:"GX-2830", submittedAt:"14 Jul · 15:35", side:"sell", type:"limit",  requestedQty:11.2, filledQty:11.2, limitPrice:0.385, slot:"15:30–16:00", status:"filled",    closedAt:"14 Jul · 15:40" }, 
  { id:"GX-2820", submittedAt:"13 Jul · 08:00", side:"sell", type:"market", requestedQty:4.0,  filledQty:0,    slot:"08:00–08:30", status:"rejected",   closedAt:"13 Jul · 08:01" }, 
  { id:"GX-2810", submittedAt:"12 Jul · 08:40", side:"sell", type:"limit",  requestedQty:7.8,  filledQty:7.8,  limitPrice:0.342, slot:"08:30–09:00", status:"filled",    closedAt:"12 Jul · 08:45" }, 
]; 
 
const DEMO_STATES: { id: HistoryDemoState; label: string }[] = [ 
  { id:"populated", label:"Populated" }, { id:"loading", label:"Loading" }, 
  { id:"empty", label:"Empty" }, { id:"error", label:"Error" }, 
]; 
 
const PAGE_SIZE = 8; 
 
// ─── Status badges ──────────────────────────────────────────────────────────── 
 
const TRADE_STATUS: Record<TradeStatus, { label: string; cls: string; dot: string }> = { 
  settled: { label:"Settled",  cls:"bg-gx-ok-bg text-gx-ok-ico border-gx-ok-brd",   dot:"bg-gx-ok-ico"   }, 
  pending: { label:"Pending",  cls:"bg-gx-warn-bg text-gx-warn-ico border-gx-warn-brd", dot:"bg-amber-400" }, 
  failed:  { label:"Failed",   cls:"bg-gx-err-bg text-gx-err-ico border-gx-err-brd", dot:"bg-gx-err-ico"  }, 
}; 
const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string }> = { 
  open:       { label:"Open",       cls:"bg-gx-info-bg text-gx-info-ico border-gx-info-brd" }, 
  pending:    { label:"Pending",    cls:"bg-gx-warn-bg text-gx-warn-ico border-gx-warn-brd" }, 
  partial:    { label:"Partial",    cls:"bg-gx-ok-bg text-gx-ok-ico border-gx-ok-brd"       }, 
  filled:     { label:"Filled",     cls:"bg-gx-ok-bg text-gx-ok-ico border-gx-ok-brd"       }, 
  cancelled:  { label:"Cancelled",  cls:"bg-secondary text-gx-fg3 border-gx-edge"           }, 
  expired:    { label:"Expired",    cls:"bg-secondary text-gx-fg3 border-gx-edge"           }, 
  rejected:   { label:"Rejected",   cls:"bg-gx-err-bg text-gx-err-ico border-gx-err-brd"   }, 
}; 
 
function StatusPill({ label, cls }: { label: string; cls: string }) { 
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>{label}</span>; 
} 
function SidePill({ side }: { side: TradeSide }) { 
  return side === "sell" 
    ? <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gx-sell-bg text-gx-sell-txt"><ArrowUpRight size={9} />Sell</span> 
    : <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gx-buy-bg text-gx-buy-txt"><ArrowDownLeft size={9} />Buy</span>; 
} 
 
// ─── Trade detail drawer ────────────────────────────────────────────────────── 
 
function TradeDrawer({ trade, onClose }: { trade: TradeRecord; onClose: () => void }) { 
  const st = TRADE_STATUS[trade.status]; 
  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}> 
      <div className="bg-card rounded-2xl border border-gx-edge shadow-[var(--gx-shadow-modal)] w-full max-w-md" onClick={e => e.stopPropagation()}> 
        <div className="flex items-center justify-between px-5 py-4 border-b border-gx-line"> 
          <div className="flex items-center gap-2"> 
            <span className="text-sm font-bold text-foreground font-mono">{trade.id}</span> 
            <StatusPill {...st} /> 
          </div> 
          <button onClick={onClose} className="text-gx-fg4 hover:text-foreground transition-colors"><X size={17} /></button> 
        </div> 
        <div className="p-5 space-y-4"> 
          <div className="flex items-center gap-2"> 
            <SidePill side={trade.side} /> 
            <span className="text-sm text-gx-fg3">{trade.slot} · {trade.executedAt}</span> 
          </div> 
          <div className="bg-secondary rounded-xl border border-gx-edge divide-y divide-gx-line text-sm"> 
            {[ 
              ["Energy",          `${trade.kWh} kWh`], 
              ["Base price",      `AED ${trade.basePrice.toFixed(3)}/kWh`], 
              ["Grid fee",        `AED ${trade.gridFee.toFixed(3)}/kWh`], 
              ["Effective price", `AED ${trade.effectivePrice.toFixed(3)}/kWh`], 
              ["Total",           `AED ${trade.totalAed.toFixed(3)}`], 
              ["Counterparty",    trade.zone], 
            ].map(([k, v]) => ( 
              <div key={k} className="flex justify-between px-4 py-2.5"> 
                <span className="text-gx-fg3">{k}</span> 
                <span className={`font-semibold font-mono text-foreground ${k === "Total" ? "text-accent" : ""}`}>{v}</span> 
              </div> 
            ))} 
          </div> 
          <p className="text-[11px] text-gx-fg4 flex items-start gap-1.5"> 
            <AlertCircle size={11} className="shrink-0 mt-0.5" /> 
            Counterparty identity is anonymised per GridX trading rules. Grid fee (AED 0.090/kWh) covers metering, settlement, and grid infrastructure. 
          </p> 
          {trade.status !== "failed" && ( 
            <Button variant="secondary" size="sm" className="w-full" onClick={() => { toast.success("Receipt downloaded."); onClose(); }}> 
              <Download size={12} />Download receipt 
            </Button> 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
} 
 
// ─── Order detail drawer ────────────────────────────────────────────────────── 
 
function OrderDrawer({ order, onClose, onCancel }: { order: OrderRecord; onClose: () => void; onCancel: (id: string) => void }) { 
  const st = ORDER_STATUS[order.status]; 
  const fillPct = order.requestedQty > 0 ? (order.filledQty / order.requestedQty) * 100 : 0; 
  const canCancel = order.status === "open" || order.status === "partial"; 
  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}> 
      <div className="bg-card rounded-2xl border border-gx-edge shadow-[var(--gx-shadow-modal)] w-full max-w-md" onClick={e => e.stopPropagation()}> 
        <div className="flex items-center justify-between px-5 py-4 border-b border-gx-line"> 
          <div className="flex items-center gap-2"> 
            <span className="text-sm font-bold text-foreground font-mono">{order.id}</span> 
            <StatusPill {...st} /> 
          </div> 
          <button onClick={onClose} className="text-gx-fg4 hover:text-foreground transition-colors"><X size={17} /></button> 
        </div> 
        <div className="p-5 space-y-4"> 
          <div className="flex items-center gap-2"> 
            <SidePill side={order.side} /> 
            <span className="text-xs text-gx-fg3 uppercase tracking-wide font-semibold">{order.type}</span> 
            <span className="text-sm text-gx-fg3">{order.slot}</span> 
          </div> 
          <div className="bg-secondary rounded-xl border border-gx-edge divide-y divide-gx-line text-sm"> 
            {[ 
              ["Submitted",       order.submittedAt], 
              ["Requested qty",   `${order.requestedQty} kWh`], 
              ["Filled qty",      `${order.filledQty} kWh`], 
              ["Limit price",     order.limitPrice ? `AED ${order.limitPrice.toFixed(3)}/kWh` : "Market"], 
              ...(order.closedAt ? [["Closed", order.closedAt]] : []), 
            ].map(([k, v]) => ( 
              <div key={k} className="flex justify-between px-4 py-2.5"> 
                <span className="text-gx-fg3">{k}</span> 
                <span className="font-semibold font-mono text-foreground">{v}</span> 
              </div> 
            ))} 
          </div> 
          {/* Fill progress */} 
          <div> 
            <div className="flex justify-between text-xs text-gx-fg4 mb-1.5"> 
              <span>Fill progress</span> 
              <span className="font-mono font-semibold text-foreground">{fillPct.toFixed(0)}%</span> 
            </div> 
            <div className="h-2 bg-secondary rounded-full overflow-hidden border border-gx-edge"> 
              <div className="h-full bg-accent rounded-full transition-all" style={{ width:`${fillPct}%` }} /> 
            </div> 
          </div> 
          {canCancel && ( 
            <Button variant="destructive" size="sm" className="w-full" onClick={() => { onCancel(order.id); onClose(); }}> 
              Cancel order 
            </Button> 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
} 
 
// ─── Orders tab ───────────────────────────────────────────────────────────────

export function OrdersTab({ state }: { state: HistoryDemoState }) {
  const [query, setQuery]     = useState("");
  const [sideF, setSideF]     = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage]       = useState(1);
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [orders, setOrders]   = useState(ORDERS);

  const filtered = useMemo(() => orders.filter(o => {
    if (sideF   !== "all" && o.side   !== sideF)   return false;
    if (statusF !== "all" && o.status !== statusF) return false;
    if (query) { const q = query.toLowerCase(); return o.id.toLowerCase().includes(q) || o.slot.includes(q); }
    return true;
  }), [query, sideF, statusF, orders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function cancelOrder(id: string) {
    setOrders(prev =>
        prev.map(o =>
        o.id === id
            ? {
                ...o,
                status: "cancelled",
                closedAt: "Now",
            }
            : o
        )
    );

    toast.success(`Order ${id} cancelled.`);
 }

  if (state === "loading") return <div className="space-y-2">{[0,1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>;
  if (state === "error")   return <EmptyState icon={XCircle} title="Failed to load orders" description="Order history could not be retrieved." action={<Button variant="secondary" size="sm"><RefreshCw size={12} />Retry</Button>} />;
  if (state === "empty")   return <EmptyState icon={FileText} title="No orders yet" description="Orders you place will appear here. Head to the Trade terminal to get started." />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gx-fg4 pointer-events-none" />
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search order ID or slot…"
            style={{ color:"var(--gx-fg1)", background:"var(--gx-inp-bg)" }}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gx-inp-brd rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
        </div>
        {[
          { val:sideF,   set:(v:string)=>{setSideF(v);setPage(1);},   opts:[{v:"all",l:"All sides"},{v:"sell",l:"Sell"},{v:"buy",l:"Buy"}] },
          { val:statusF, set:(v:string)=>{setStatusF(v);setPage(1);}, opts:[{v:"all",l:"All status"},{v:"open",l:"Open"},{v:"partial",l:"Partial"},{v:"filled",l:"Filled"},{v:"cancelled",l:"Cancelled"},{v:"expired",l:"Expired"},{v:"rejected",l:"Rejected"}] },
        ].map((f, fi) => (
          <div key={fi} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              style={{ color:"var(--gx-fg1)", background:"var(--gx-inp-bg)" }}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gx-inp-brd rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 cursor-pointer">
              {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gx-fg4 pointer-events-none" />
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Filter} title="No results" description="Adjust your filters." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-card rounded-2xl border border-gx-edge overflow-hidden shadow-[var(--gx-shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gx-line bg-secondary/60">
                    {["Submitted","ID","Side","Type","Req. qty","Filled","Limit price","Slot","Status","Actions"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-gx-fg4 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gx-line">
                  {paged.map(o => {
                    const canCancel = o.status === "open" || o.status === "partial";
                    return (
                      <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="px-3 py-3 text-gx-fg3 whitespace-nowrap">{o.submittedAt}</td>
                        <td className="px-3 py-3 font-mono font-semibold text-foreground">{o.id}</td>
                        <td className="px-3 py-3"><SidePill side={o.side} /></td>
                        <td className="px-3 py-3 text-gx-fg2 capitalize font-medium">{o.type}</td>
                        <td className="px-3 py-3 font-mono text-foreground">{o.requestedQty}</td>
                        <td className="px-3 py-3 font-mono text-foreground">{o.filledQty}</td>
                        <td className="px-3 py-3 font-mono text-foreground">{o.limitPrice ? o.limitPrice.toFixed(3) : <span className="text-gx-fg4">Market</span>}</td>
                        <td className="px-3 py-3 font-mono text-gx-fg2 whitespace-nowrap">{o.slot}</td>
                        <td className="px-3 py-3"><StatusPill {...ORDER_STATUS[o.status]} /></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelected(o)} className="p-1.5 rounded-lg text-gx-fg4 hover:text-foreground hover:bg-secondary transition-all" title="View">
                              <Eye size={13} />
                            </button>
                            {canCancel && (
                              <button onClick={() => cancelOrder(o.id)}
                                className="p-1.5 rounded-lg text-gx-fg4 hover:text-gx-err-ico hover:bg-gx-err-bg transition-all" title="Cancel">
                                <XCircle size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paged.map(o => (
              <div key={o.id} className="bg-card rounded-xl border border-gx-edge p-4 shadow-[var(--gx-shadow-card)]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SidePill side={o.side} />
                    <span className="font-mono text-sm font-semibold text-foreground">{o.id}</span>
                    <span className="text-xs text-gx-fg4 capitalize">{o.type}</span>
                  </div>
                  <StatusPill {...ORDER_STATUS[o.status]} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gx-fg3">{o.slot} · {o.submittedAt}</span>
                  <span className="font-mono text-foreground">{o.filledQty}/{o.requestedQty} kWh</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setSelected(o)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gx-edge text-xs font-medium text-gx-fg3 hover:bg-secondary transition-all">
                    <Eye size={12} />View
                  </button>
                  {(o.status === "open" || o.status === "partial") && (
                    <button onClick={() => cancelOrder(o.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gx-err-brd text-xs font-medium text-gx-err-txt hover:bg-gx-err-bg transition-all">
                      <XCircle size={12} />Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gx-fg4">{filtered.length} order{filtered.length !== 1 ? "s" : ""} · page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gx-edge text-gx-fg4 hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gx-edge text-gx-fg4 hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
      {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} onCancel={cancelOrder} />}
    </div>
  );
}
 
 
 
 
 
 
 
 
 
{/* TODO: Need to check */} 
function Skeleton({ className = "" }: { className?: string }) { 
  return ( 
    <div className={`rounded-lg ${className}`} style={{ 
      background: "linear-gradient(90deg, var(--gx-sk-from) 0%, var(--gx-sk-via) 50%, var(--gx-sk-from) 100%)", 
      backgroundSize: "200% 100%", animation: "gx-shimmer 1.6s ease-in-out infinite", 
    }} /> 
  ); 
} 
 
// ─── EmptyState ─────────────────────────────────────────────────────────────── 
 
function EmptyState({ icon: Icon, title, description, action }: { 
  icon: React.ElementType; title: string; description: string; action?: React.ReactNode; 
}) { 
  return ( 
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center"> 
      <div className="w-14 h-14 rounded-2xl bg-gx-well flex items-center justify-center mb-4"> 
        <Icon size={22} className="text-gx-fg4" /> 
      </div> 
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3> 
      <p className="text-sm text-gx-fg3 max-w-xs mb-5">{description}</p> 
      {action} 
    </div> 
  ); 
}