import { createFileRoute } from '@tanstack/react-router'

import EnergyView from '#/components/energy-assets/EnergyView'

export const Route = createFileRoute('/_authenticated/energy-assets')({
  component: EnergyView,
})
