import type { EChartsCoreOption } from 'echarts/core';

import { MARKET_TIME_ZONE } from '#/data/currency';
import type { EnergyBucket, EnergyRange } from './api';
import type { PeakMatrix } from './view-model';

/** Colours read from the design tokens (see components/charts/theme.ts). */
export interface ChartColors {
  generated: string;
  consumed: string;
  exported: string;
  imported: string;
  grid: string;
  text: string;
  palette: Array<string>;
}

type Point = [string, number];

const kwLabel = (value: number) => `${value} kW`;

/** `extent` pins the axis to the selected period instead of the data's span. */
function timeAxes(colors: ChartColors, extent?: EnergyRange) {
  return {
    grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number) => `${Number(value).toFixed(2)} kW`,
    },
    xAxis: {
      type: 'time',
      min: extent?.from,
      max: extent?.to,
      axisLine: { lineStyle: { color: colors.grid } },
      axisLabel: {
        color: colors.text,
        formatter: (value: number) =>
          new Intl.DateTimeFormat('en-GB', {
            timeZone: MARKET_TIME_ZONE,
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          })
            .format(value)
            .replace(',', ''),
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.text, formatter: kwLabel },
      splitLine: { lineStyle: { color: colors.grid, type: 'dashed' } },
    },
  };
}

function line(
  name: string,
  data: Array<Point>,
  color: string,
  extra: object = {},
) {
  return {
    name,
    type: 'line',
    data,
    showSymbol: false,
    smooth: true,
    lineStyle: { color, width: 2 },
    itemStyle: { color },
    ...extra,
  };
}

const points = (
  buckets: Array<EnergyBucket>,
  pick: (b: EnergyBucket) => number,
): Array<Point> => buckets.map((bucket) => [bucket.startsAt, pick(bucket)]);

export function generationChartOption(
  buckets: Array<EnergyBucket>,
  colors: ChartColors,
  extent?: EnergyRange,
): EChartsCoreOption {
  return {
    ...timeAxes(colors, extent),
    series: [
      line(
        'Generated',
        points(buckets, (b) => b.averagePower.solarKw),
        colors.generated,
        {
          areaStyle: { color: colors.generated, opacity: 0.15 },
        },
      ),
      line(
        'Consumed',
        points(buckets, (b) => b.averagePower.consumptionKw),
        colors.consumed,
        {
          lineStyle: { color: colors.consumed, width: 2, type: 'dashed' },
        },
      ),
      line(
        'Exported',
        points(buckets, (b) => b.averagePower.exportKw),
        colors.exported,
      ),
    ],
  };
}

export function energySeriesChartOption(
  buckets: Array<EnergyBucket>,
  colors: ChartColors,
  nowIso: string,
  extent?: EnergyRange,
): EChartsCoreOption {
  const showNow = !extent || (nowIso >= extent.from && nowIso < extent.to);
  return {
    ...timeAxes(colors, extent),
    series: [
      line(
        'Generated',
        points(buckets, (b) => b.averagePower.solarKw),
        colors.generated,
        showNow
          ? {
              markLine: {
                symbol: 'none',
                label: { formatter: 'Now', color: colors.text },
                lineStyle: { color: colors.text, type: 'dashed' },
                data: [{ xAxis: nowIso }],
              },
            }
          : {},
      ),
      line(
        'Consumed',
        points(buckets, (b) => b.averagePower.consumptionKw),
        colors.consumed,
      ),
      line(
        'Exported',
        points(buckets, (b) => b.averagePower.exportKw),
        colors.exported,
      ),
      line(
        'Imported',
        points(buckets, (b) => b.averagePower.importKw),
        colors.imported,
      ),
    ],
  };
}

export function forecastChartOption(
  actual: Array<EnergyBucket>,
  forecast: Array<Point>,
  colors: ChartColors,
  extent?: EnergyRange,
): EChartsCoreOption {
  return {
    ...timeAxes(colors, extent),
    series: [
      line('Forecast', forecast, colors.consumed, {
        lineStyle: { color: colors.consumed, width: 2, type: 'dashed' },
      }),
      line(
        'Actual',
        points(actual, (b) => b.averagePower.solarKw),
        colors.generated,
        {
          showSymbol: true,
          symbolSize: 5,
        },
      ),
    ],
  };
}

export function usageDonutOption(
  categories: Array<{ label: string; valueKwh: number; color?: string }>,
  colors: ChartColors,
): EChartsCoreOption {
  return {
    color: colors.palette,
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) => `${value} kWh`,
    },
    series: [
      {
        type: 'pie',
        radius: ['58%', '82%'],
        label: { show: false },
        data: categories.map(({ label, valueKwh, color }) => ({
          name: label,
          value: valueKwh,
          ...(color ? { itemStyle: { color } } : {}),
        })),
      },
    ],
  };
}

export function peakHeatmapOption(
  matrix: PeakMatrix,
  colors: ChartColors,
): EChartsCoreOption {
  const hours = Array.from({ length: 24 }, (_, hour) =>
    String(hour).padStart(2, '0'),
  );
  return {
    grid: { left: 8, right: 8, top: 8, bottom: 40, containLabel: true },
    tooltip: {
      formatter: ({ value }: { value: [number, number, number] }) =>
        `${matrix.days[value[1]]} ${hours[value[0]]}:00 · ${value[2]} kW`,
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: false },
      axisLabel: { color: colors.text },
    },
    yAxis: {
      type: 'category',
      data: matrix.days,
      inverse: true,
      axisLabel: { color: colors.text },
    },
    visualMap: {
      min: 0,
      max: matrix.max,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemHeight: 120,
      textStyle: { color: colors.text },
      inRange: { color: [colors.grid, colors.generated] },
    },
    series: [
      { type: 'heatmap', data: matrix.cells, itemStyle: { borderRadius: 3 } },
    ],
  };
}
