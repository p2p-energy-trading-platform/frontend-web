import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/tradehistory')({
  beforeLoad: () => {
    throw redirect({ to: '/history/trades' })
  },
})
