import { ArrowDownLeft, Clock, Lock } from 'lucide-react'

import { BalanceMetricCard } from './BalanceMetricCard'

export function BalanceMetrics({
  pending,
  reserved,
  lifetimeIn,
}: {
  pending: string
  reserved: string
  lifetimeIn: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <BalanceMetricCard
        icon={Clock}
        title="PENDING"
        amount={pending}
        description="Setting"
      />

      <BalanceMetricCard
        icon={Lock}
        title="RESERVED"
        amount={reserved}
        description="Open orders"
      />

      <BalanceMetricCard
        icon={ArrowDownLeft}
        title="LIFETIME IN"
        amount={lifetimeIn}
        description="All deposits"
      />
    </div>
  )
}
