import { useState } from 'react'
import { Plus } from 'lucide-react'

import { CardList } from './CardList'
import { BankAccountList } from './BankAccountList'
import { PaymentMethodTabs } from './PaymentMethodTabs'
import { useWallet } from '#/hooks/useWallet'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export function PaymentMethods() {
  const wallet = useWallet()
  const [tab, setTab] = useState<'cards' | 'banks'>('cards')

  return (
    <Card className="w-full lg:min-w-0 lg:flex-1">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Payment methods</h3>

          <Button variant="outline">
            <Plus className="size-4" />
            Add
          </Button>
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
      </CardContent>
    </Card>
  )
}
