import { createFileRoute } from '@tanstack/react-router'

import { BalanceHero } from '#/components/wallet/BalanceHero'
import { TransactionHistory } from '#/components/wallet/TransactionHistory'
import { PaymentMethods } from '#/components/wallet/PaymentMethods.tsx'

export const Route = createFileRoute('/_authenticated/wallet')({
  component: Wallet,
})

function Wallet() {
  return (
    <main className="mx-auto flex w-full flex-col gap-5 p-6">
      <BalanceHero />

      <div className="flex flex-row w-full gap-7">
        <TransactionHistory />
        <PaymentMethods />
      </div>
    </main>
  )
}
