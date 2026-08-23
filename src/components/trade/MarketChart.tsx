import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
} from 'lightweight-charts'
import type { CandlestickData, Time } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'

import type { Timeframe } from './types'

interface TooltipData {
  left: number
  top: number
  timestamp: Date
  candle: CandlestickData<Time>
}

function makeCandles(timeframe: Timeframe): Array<CandlestickData<Time>> {
  const intervals: Record<Timeframe, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
  }
  const step = intervals[timeframe]
  const now = Math.floor(Date.now() / 1000 / step) * step
  let last = 0.444

  return Array.from({ length: 72 }, (_, index) => {
    const drift =
      Math.sin(index * 0.57) * 0.0026 + Math.cos(index * 0.21) * 0.0012
    const open = last
    const close = Math.max(0.41, open + drift)
    const high = Math.max(open, close) + 0.0012 + (index % 3) * 0.00035
    const low = Math.min(open, close) - 0.0011 - (index % 4) * 0.00025
    last = close
    return {
      time: (now - (71 - index) * step) as Time,
      open,
      high,
      low,
      close,
    }
  })
}

export function MarketChart({ timeframe }: { timeframe: Timeframe }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const styles = getComputedStyle(document.documentElement)
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 390,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor:
          styles.getPropertyValue('--text-tertiary').trim() || '#6b7a99',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(107,122,153,.10)' },
        horzLines: { color: 'rgba(107,122,153,.10)' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: 'rgba(107,122,153,.18)' },
      timeScale: {
        borderColor: 'rgba(107,122,153,.18)',
        timeVisible: true,
        secondsVisible: false,
      },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#0ea592',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#0ea592',
      wickDownColor: '#ef4444',
      priceFormat: { type: 'price', precision: 3, minMove: 0.001 },
    })
    series.setData(makeCandles(timeframe))
    ;[0.47, 0.452].forEach((price) =>
      series.createPriceLine({
        price,
        color: price === 0.47 ? '#0ea592' : 'rgba(107,122,153,.6)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      }),
    )
    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null)
        return
      }
      const candle = param.seriesData.get(series) as
        CandlestickData<Time> | undefined
      if (!candle) {
        setTooltip(null)
        return
      }
      setTooltip({
        left: Math.min(param.point.x + 14, container.clientWidth - 195),
        top: Math.max(param.point.y - 70, 8),
        timestamp: new Date(Number(param.time) * 1000),
        candle,
      })
    })

    const observer = new ResizeObserver(([entry]) => {
      chart.applyOptions({ width: entry.contentRect.width })
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [timeframe])

  return (
    <div className="relative min-h-[390px] w-full" ref={containerRef}>
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
  )
}
