import { useState } from 'react'
import { Plus } from 'lucide-react'

import { CardList } from './CardList'
import { BankAccountList } from './BankAccountList'
import { PaymentMethodTabs } from './PaymentMethodTabs'
import { SAMPLE_CARDS, SAMPLE_ACCOUNTS } from './paymentMethodData'

export function PaymentMethods() {
  const [tab, setTab] = useState<'cards' | 'banks'>('cards')

  return (
    <div className="bg-card rounded-2xl border border-border-default p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Payment methods</h3>

        <button className="flex items-center gap-1.5 text-caption text-accent hover:text-accent">
          <Plus size={13} />
          Add
        </button>
      </div>

      <PaymentMethodTabs tab={tab} setTab={setTab} />

      {tab === 'cards' ? (
        <CardList cards={SAMPLE_CARDS} />
      ) : (
        <BankAccountList accounts={SAMPLE_ACCOUNTS} />
      )}
    </div>
  )
}
