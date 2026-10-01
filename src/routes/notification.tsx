import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/notification')({
  beforeLoad: () => {
    throw redirect({ to: '/notifications' })
  },
})
