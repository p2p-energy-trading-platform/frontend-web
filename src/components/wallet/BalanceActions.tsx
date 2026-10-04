import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { Button } from '#/components/ui/button'

export function BalanceActions() {
  return (
    <div className="space-x-2">
      <Button size="lg" className="px-4">
        <ArrowDownLeft />
        Deposit
      </Button>

      <Button
        variant="outline"
        className="px-4"
        size="lg"
      >
        <ArrowUpRight />
        Withdraw
      </Button>
    </div>
  )
}
