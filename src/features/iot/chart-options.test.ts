import { describe, expect, it } from 'vitest';

import type { EnergyBucket } from './api';
import {
  energySeriesChartOption,
  forecastChartOption,
  generationChartOption,
  peakHeatmapOption,
  usageDonutOption,
} from './chart-options';
import type { ChartColors } from './chart-options';

const colors: ChartColors = {
  generated: '#0ea592',
  consumed: '#6b7a99',
  exported: '#3b82f6',
  imported: '#f59e0b',
  grid: '#eeeeee',
  text: '#6b7a99',
  palette: ['#0ea592', '#3b82f6', '#f59e0b', '#8b5cf6'],
};

const bucket = (
  startsAt: string,
  solarKw: number,
  consumptionKw: number,
): EnergyBucket => ({
  startsAt,
  energy: {
    generatedKwh: 0,
    consumedKwh: 0,
    exportedKwh: 0,
    importedKwh: 0,
    storageChargedKwh: 0,
    storageDischargedKwh: 0,
  },
  averagePower: { solarKw, consumptionKw, exportKw: 0.5, importKw: 0.25 },
});

const buckets = [
  bucket('2026-11-01T04:00:00.000Z', 1.5, 2),
  bucket('2026-11-01T04:30:00.000Z', 2.5, 1),
];

type Series = Array<{
  name: string;
  data: Array<unknown>;
  lineStyle?: { color?: string; type?: string };
}>;

describe('chart options', () => {
  it('plots generation, consumption and export over time', () => {
    const series = generationChartOption(buckets, colors).series as Series;
    expect(series.map((s) => s.name)).toEqual([
      'Generated',
      'Consumed',
      'Exported',
    ]);
    expect(series[0].data).toEqual([
      ['2026-11-01T04:00:00.000Z', 1.5],
      ['2026-11-01T04:30:00.000Z', 2.5],
    ]);
    expect(series[0].lineStyle?.color).toBe(colors.generated);
    expect(series[1].lineStyle?.type).toBe('dashed');
  });

  it('adds imports to the energy time series and marks now', () => {
    const option = energySeriesChartOption(
      buckets,
      colors,
      '2026-11-01T04:15:00.000Z',
    );
    const series = option.series as Array<
      Series[number] & { markLine?: { data: Array<{ xAxis: string }> } }
    >;
    expect(series.map((s) => s.name)).toEqual([
      'Generated',
      'Consumed',
      'Exported',
      'Imported',
    ]);
    expect(series[3].data).toEqual([
      ['2026-11-01T04:00:00.000Z', 0.25],
      ['2026-11-01T04:30:00.000Z', 0.25],
    ]);
    expect(series[0].markLine?.data).toEqual([
      { xAxis: '2026-11-01T04:15:00.000Z' },
    ]);
  });

  it('draws empty series when there is no data', () => {
    const series = generationChartOption([], colors).series as Series;
    expect(series.every((s) => s.data.length === 0)).toBe(true);
  });

  it('draws the actual solar line next to the sample forecast', () => {
    const forecast: Array<[string, number]> = [['2026-11-01T04:00:00.000Z', 2]];
    const series = forecastChartOption(buckets, forecast, colors)
      .series as Series;
    expect(series.map((s) => s.name)).toEqual(['Forecast', 'Actual']);
    expect(series[0].lineStyle?.type).toBe('dashed');
    expect(series[1].data).toEqual([
      ['2026-11-01T04:00:00.000Z', 1.5],
      ['2026-11-01T04:30:00.000Z', 2.5],
    ]);
  });

  it('shows usage categories as a donut', () => {
    const series = usageDonutOption(
      [
        { label: 'Air Conditioning', valueKwh: 18.4, color: '#f59e0b' },
        { label: 'Other', valueKwh: 1.9 },
      ],
      colors,
    ).series as Array<{ type: string; data: unknown }>;
    expect(series[0].type).toBe('pie');
    expect(series[0].data).toEqual([
      {
        name: 'Air Conditioning',
        value: 18.4,
        itemStyle: { color: '#f59e0b' },
      },
      { name: 'Other', value: 1.9 },
    ]);
  });

  it('colours the weekday × hour heatmap up to the busiest hour', () => {
    const option = peakHeatmapOption(
      {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        cells: [[19, 6, 3]],
        max: 3,
      },
      colors,
    );
    const visualMap = option.visualMap as { min: number; max: number };
    expect(visualMap).toMatchObject({ min: 0, max: 3 });
    expect((option.series as Array<{ data: unknown }>)[0].data).toEqual([
      [19, 6, 3],
    ]);
    expect((option.xAxis as { data: Array<string> }).data).toHaveLength(24);
  });
});

describe('time axis extent', () => {
  const extent = {
    from: '2026-10-31T20:00:00.000Z',
    to: '2026-11-01T20:00:00.000Z',
  };

  it('pins the axis to the selected range', () => {
    const option = generationChartOption([], colors, extent) as {
      xAxis: { min?: string; max?: string };
    };
    expect(option.xAxis).toMatchObject({ min: extent.from, max: extent.to });
  });

  it('only marks "Now" when it falls inside the range', () => {
    const markLines = (nowIso: string) =>
      (
        energySeriesChartOption([], colors, nowIso, extent).series as Array<{
          markLine?: unknown;
        }>
      ).filter((series) => series.markLine).length;
    expect(markLines('2026-11-01T10:00:00.000Z')).toBe(1);
    expect(markLines('2026-11-02T10:00:00.000Z')).toBe(0);
  });
});

describe('line visibility', () => {
  const pointAt = (startsAt: string): EnergyBucket => ({
    startsAt,
    energy: {
      generatedKwh: 0.4,
      consumedKwh: 0.4,
      exportedKwh: 0,
      importedKwh: 0,
      storageChargedKwh: 0,
      storageDischargedKwh: 0,
    },
    averagePower: {
      solarKw: 0.8,
      consumptionKw: 0.8,
      exportKw: 0,
      importKw: 0,
    },
  });
  const symbols = (data: Array<EnergyBucket>) =>
    (
      generationChartOption(data, colors).series as Array<{
        showSymbol: boolean;
      }>
    ).map((series) => series.showSymbol);

  it('shows a marker when there is only one point, which draws no line', () => {
    expect(symbols([pointAt('2026-11-02T09:00:00Z')])).toEqual([
      true,
      true,
      true,
    ]);
  });

  it('hides markers once there is a line to draw', () => {
    expect(
      symbols([
        pointAt('2026-11-02T09:00:00Z'),
        pointAt('2026-11-02T09:30:00Z'),
      ]),
    ).toEqual([false, false, false]);
  });
});
