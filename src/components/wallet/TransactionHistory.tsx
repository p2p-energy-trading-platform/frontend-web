import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { Card } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

const transactions = [

    {
      title: 'Energy purchase',
      date: '07 Aug 2026 · 10:30 AM',
      amount: '- AED 25.00',
      type: 'buy',
    },
    {
      title: 'Energy sold',
      date: '06 Aug 2026 · 04:15 PM',
      amount: '+ AED 42.50',
      type: 'sell',
    }

]

export function TransactionHistory() {

    return (

        <Card className="flex flex-col w-3/5 gap-6 border-border-subtle bg-card p-6">

            <div className="flex flex-row justify-between items-center">
                <h2 className="text-heading-4 text-text-secondary">
                    Transaction History
                </h2>

                <Button variant="outline" className="border-primary cursor-pointer" size="lg">
                    <ArrowUpRight />
                    Export CSV
                </Button>
            </div>

            <div className="flex flex-row justify-between items-center gap-3">
                
                <Input
                    placeholder="Search description or reference"
                />

                <select className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-text-primary outline-none">
                    <option value="all">All Transactions</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
                
            </div>
            
            {transactions.map((transaction) => (

                <div
                    key={transaction.title}
                    className="flex items-center justify-between border-b border-border-subtle pb-3"
                >

                    <div className="flex items-center gap-3">

                        {transaction.type === 'buy'
                            ? <ArrowDownLeft className="size-5 text-text-secondary" />
                            : <ArrowUpRight className="size-5 text-text-secondary" />
                        }

                        <div>

                            <p className="text-text-primary">
                                {transaction.title}
                            </p>

                            <p className="text-caption text-text-secondary">
                                {transaction.date}
                            </p>

                        </div>

                    </div>


                    <p
                        className={
                            transaction.type === 'buy'
                            ? "text-text-primary"
                            : "text-feedback-success-text"
                        }
                    >
                        {transaction.amount}
                    </p>


                </div>

            ))}

        </Card>

    )

}