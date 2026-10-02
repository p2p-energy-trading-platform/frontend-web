import { createFileRoute } from '@tanstack/react-router'

import { EnergyPage } from '#/components/energy-assets/EnergyPage'

export const Route = createFileRoute('/_authenticated/energy-assets')({
  component: EnergyPage,
})
