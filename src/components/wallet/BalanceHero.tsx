import { ArrowUpRight, ArrowDownLeft, Clock, Lock } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { BalanceOverview } from './BalanceOverview'
import { BalanceMetrics } from './BalanceMetrics'
import { BalanceActions } from './BalanceActions'

export function BalanceHero() {
  return (
    <Card className="flex flex-col items-start justify-start gap-6 border-border-subtle bg-card p-5">
      <BalanceOverview />

      <BalanceMetrics />

      <BalanceActions />
    </Card>
  )
}
