import type { CandlestickData, Time } from 'lightweight-charts';
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface TooltipData {
  left: number;
  top: number;
  timestamp: Date;
  candle: CandlestickData<Time>;
}

export function MarketChart({
  candles,
}: {
  candles: Array<CandlestickData<Time>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    const withAlpha = (hex: string, alpha: number) => {
      const value = hex.replace('#', '');
      const r = Number.parseInt(value.slice(0, 2), 16);
      const g = Number.parseInt(value.slice(2, 4), 16);
      const b = Number.parseInt(value.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const text = token('--text-tertiary');
    const accent = token('--action-accent');
    const danger = token('--action-danger');
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 390,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: text,
        fontFamily:
          token('--font-sans') || 'Inter, ui-sans-serif, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: withAlpha(text, 0.1) },
        horzLines: { color: withAlpha(text, 0.1) },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: withAlpha(text, 0.18) },
      timeScale: {
        borderColor: withAlpha(text, 0.18),
        timeVisible: true,
        secondsVisible: false,
      },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: accent,
      downColor: danger,
      borderVisible: false,
      wickUpColor: accent,
      wickDownColor: danger,
      priceFormat: { type: 'price', precision: 3, minMove: 0.001 },
    });
    series.setData(candles);
    [0.47, 0.452].forEach((price) =>
      series.createPriceLine({
        price,
        color: price === 0.47 ? accent : withAlpha(text, 0.6),
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      }),
    );
    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const candle = param.seriesData.get(series) as
        CandlestickData<Time> | undefined;
      if (!candle) {
        setTooltip(null);
        return;
      }
      setTooltip({
        left: Math.min(param.point.x + 14, container.clientWidth - 195),
        top: Math.max(param.point.y - 70, 8),
        timestamp: new Date(Number(param.time) * 1000),
        candle,
      });
    });

    const observer = new ResizeObserver(([entry]) => {
      chart.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [candles]);

  return (
    <div className="relative min-h-97.5 w-full" ref={containerRef}>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-border-default bg-card/95 px-3 py-2 text-xs leading-5 text-text-secondary shadow-lg backdrop-blur"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          <strong>{tooltip.timestamp.toLocaleString()}</strong>
          <br />O {tooltip.candle.open.toFixed(3)} &nbsp; H{' '}
          {tooltip.candle.high.toFixed(3)}
          <br />L {tooltip.candle.low.toFixed(3)} &nbsp; C{' '}
          {tooltip.candle.close.toFixed(3)}
        </div>
      )}
    </div>
  );
}
