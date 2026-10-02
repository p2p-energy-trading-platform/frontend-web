import { Card } from '#/components/ui/card'
import { useWallet } from '#/hooks/useWallet'
import { BalanceOverview } from './BalanceOverview'
import { BalanceMetrics } from './BalanceMetrics'
import { BalanceActions } from './BalanceActions'

export function BalanceHero() {
  const wallet = useWallet()

  return (
    <Card
      className="flex flex-col items-start justify-start gap-6 border-border-subtle bg-card p-5"
      data-source={wallet.source}
    >
      <BalanceOverview
        available={wallet.balance.available}
        creditNote={wallet.balance.creditNote}
      />

      <BalanceMetrics
        pending={wallet.balance.pending}
        reserved={wallet.balance.reserved}
        lifetimeIn={wallet.balance.lifetimeIn}
      />

      <BalanceActions />
    </Card>
  )
}
