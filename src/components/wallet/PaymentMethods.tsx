import { useState } from 'react'
import { Plus } from 'lucide-react'

import { CardList } from './CardList'
import { BankAccountList } from './BankAccountList'
import { PaymentMethodTabs } from './PaymentMethodTabs'
import { useWallet } from '#/hooks/useWallet'

export function PaymentMethods() {
  const wallet = useWallet()
  const [tab, setTab] = useState<'cards' | 'banks'>('cards')

  return (
    <div className="w-full rounded-2xl border border-border-default bg-card p-5 lg:min-w-0 lg:flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Payment methods</h3>

        <button className="flex items-center gap-1.5 text-caption text-accent hover:text-accent">
          <Plus size={13} />
          Add
        </button>
      </div>

      <PaymentMethodTabs tab={tab} setTab={setTab} />

      {tab === 'cards' ? (
        <CardList cards={wallet.cards} />
      ) : (
        <BankAccountList
          accounts={wallet.accounts}
          verificationNote={wallet.balance.verificationNote}
        />
      )}
    </div>
  )
}
