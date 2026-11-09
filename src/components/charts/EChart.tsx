import { useEffect, useRef } from 'react';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';

import { cn } from 'cn';
import { echarts } from './echarts';

export interface EChartProps {
  option: EChartsCoreOption;
  ariaLabel: string;
  className?: string;
}

/** Renders an ECharts option and keeps it sized to its container. */
export function EChart({ option, ariaLabel, className }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = echarts.init(container);
    chartRef.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={cn('h-56 w-full', className)}
    />
  );
}
