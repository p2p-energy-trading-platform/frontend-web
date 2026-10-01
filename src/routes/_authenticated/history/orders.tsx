import { createFileRoute } from '@tanstack/react-router'

import { OrdersTab } from '#/components/history/OrderHistory'

export const Route = createFileRoute('/_authenticated/history/orders')({
  component: OrderHistoryPage,
})

function OrderHistoryPage() {
  return <OrdersTab state="populated" />
}
