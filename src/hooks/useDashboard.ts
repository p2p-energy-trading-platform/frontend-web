import {
  dashboardView,
  generationAxis,
  generationPoints,
} from '#/data/dashboard'

export function useDashboard() {
  return {
    source: 'demo' as const,
    ...dashboardView,
  }
}

export function useGenerationSeries() {
  return {
    source: 'demo' as const,
    points: generationPoints,
    ...generationAxis,
  }
}
