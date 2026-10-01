import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/energyassets')({
  beforeLoad: () => {
    throw redirect({ to: '/energy-assets' })
  },
})
