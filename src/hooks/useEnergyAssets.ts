import {
  consumedSeries,
  energyAssets,
  energyBalance,
  energyInsights,
  energyKpis,
  energyPageMeta,
  energySeriesAxis,
  forecastActual,
  forecastAxis,
  forecastSeries,
  generatedSeries,
  peakDays,
  peakHourLabels,
  peakMatrix,
  usageCategories,
} from '#/data/energy-assets'

export function useEnergyAssets() {
  return {
    source: 'demo' as const,
    assets: energyAssets,
    meta: energyPageMeta,
    kpis: energyKpis,
    categories: usageCategories,
    balance: energyBalance,
    insights: energyInsights,
  }
}

export function useEnergySeries() {
  return {
    source: 'demo' as const,
    generated: generatedSeries,
    consumed: consumedSeries,
    ...energySeriesAxis,
  }
}

export function useForecastSeries() {
  return {
    source: 'demo' as const,
    forecast: forecastSeries,
    actual: forecastActual,
    ...forecastAxis,
  }
}

export function usePeakPeriods() {
  return {
    source: 'demo' as const,
    days: peakDays,
    matrix: peakMatrix,
    hourLabels: peakHourLabels,
  }
}
