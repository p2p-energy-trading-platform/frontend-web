import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/page-components/Header'
import Sidebar from '#/components/page-components/Sidebar'
import { BalanceHero } from '#/components/wallet/BalanceHero'
import { TransactionHistory } from '#/components/wallet/TransactionHistory'
import { PaymentMethods } from '#/components/wallet/PaymentMethods.tsx'

export const Route = createFileRoute('/wallet')({
  component: Wallet,
})

function Wallet() {
  const user = {
    name: 'Sara A.',
    role: 'Prosumer',
    initials: 'SA',
    property: 'Villa 47',
    zone: 'JLT Zone 4',
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          propertyName="Villa 47"
          zoneLabel="JLT Zone 4"
          meterOnline
          notificationCount={3}
          user={user}
        />

        <main className="mx-auto flex w-full flex-col gap-5 p-6">
          <BalanceHero />

          <div className="flex flex-row w-full gap-7">
            <TransactionHistory />
            <PaymentMethods />
          </div>
        </main>
      </div>
    </div>
  )
}
