import type { EChartsCoreOption } from 'echarts/core';

import { MARKET_TIME_ZONE } from '#/data/currency';
import type { EnergyBucket, EnergyBucketSize, EnergyRange } from './api';
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

type Point = [string, number | null];

/** The selected period; with its bucket size, missing buckets show as gaps. */
type ChartRange = EnergyRange & { bucket?: EnergyBucketSize };

const BUCKET_MS: Record<EnergyBucketSize, number> = {
  '5m': 300_000,
  '15m': 900_000,
  '30m': 1_800_000,
  '1h': 3_600_000,
  '1d': 86_400_000,
};

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
    // A point with no neighbour draws no line, so it needs a marker to be visible.
    showSymbol: data.some(
      ([, value], index) =>
        value !== null &&
        (data[index - 1]?.[1] ?? null) === null &&
        (data[index + 1]?.[1] ?? null) === null,
    ),
    smooth: true,
    lineStyle: { color, width: 2 },
    itemStyle: { color },
    ...extra,
  };
}

/**
 * The API only returns buckets that have readings, so where buckets are
 * missing an empty point is added to break the line instead of joining
 * across hours with no data.
 */
function points(
  buckets: Array<EnergyBucket>,
  pick: (b: EnergyBucket) => number,
  bucket?: EnergyBucketSize,
): Array<Point> {
  const width = bucket ? BUCKET_MS[bucket] : undefined;
  return buckets.flatMap((current, index): Array<Point> => {
    const point: Point = [current.startsAt, pick(current)];
    const previous = buckets.at(index - 1);
    if (!width || index === 0 || !previous) return [point];
    const gapStart = Date.parse(previous.startsAt) + width;
    return Date.parse(current.startsAt) > gapStart
      ? [[new Date(gapStart).toISOString(), null], point]
      : [point];
  });
}

export function generationChartOption(
  buckets: Array<EnergyBucket>,
  colors: ChartColors,
  extent?: ChartRange,
): EChartsCoreOption {
  return {
    ...timeAxes(colors, extent),
    series: [
      line(
        'Generated',
        points(buckets, (b) => b.averagePower.solarKw, extent?.bucket),
        colors.generated,
        {
          areaStyle: { color: colors.generated, opacity: 0.15 },
        },
      ),
      line(
        'Consumed',
        points(buckets, (b) => b.averagePower.consumptionKw, extent?.bucket),
        colors.consumed,
        {
          lineStyle: { color: colors.consumed, width: 2, type: 'dashed' },
        },
      ),
      line(
        'Exported',
        points(buckets, (b) => b.averagePower.exportKw, extent?.bucket),
        colors.exported,
      ),
    ],
  };
}

export function energySeriesChartOption(
  buckets: Array<EnergyBucket>,
  colors: ChartColors,
  nowIso: string,
  extent?: ChartRange,
): EChartsCoreOption {
  const showNow = !extent || (nowIso >= extent.from && nowIso < extent.to);
  return {
    ...timeAxes(colors, extent),
    series: [
      line(
        'Generated',
        points(buckets, (b) => b.averagePower.solarKw, extent?.bucket),
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
        points(buckets, (b) => b.averagePower.consumptionKw, extent?.bucket),
        colors.consumed,
      ),
      line(
        'Exported',
        points(buckets, (b) => b.averagePower.exportKw, extent?.bucket),
        colors.exported,
      ),
      line(
        'Imported',
        points(buckets, (b) => b.averagePower.importKw, extent?.bucket),
        colors.imported,
      ),
    ],
  };
}

export function forecastChartOption(
  actual: Array<EnergyBucket>,
  forecast: Array<Point>,
  colors: ChartColors,
  extent?: ChartRange,
): EChartsCoreOption {
  return {
    ...timeAxes(colors, extent),
    series: [
      line('Forecast', forecast, colors.consumed, {
        lineStyle: { color: colors.consumed, width: 2, type: 'dashed' },
      }),
      line(
        'Actual',
        points(actual, (b) => b.averagePower.solarKw, extent?.bucket),
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
