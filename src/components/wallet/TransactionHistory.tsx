import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import { useWallet } from '#/hooks/useWallet'

export function TransactionHistory() {
  const wallet = useWallet()
  return (
    <Card
      className="flex w-full flex-col gap-6 border-border-subtle bg-card p-6 lg:min-h-96 lg:w-3/5"
      data-source={wallet.source}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-heading-4 text-text-secondary">
          Transaction History
        </h2>

        <Button
          variant="outline"
          className="border-primary cursor-pointer"
          size="lg"
        >
          <ArrowUpRight />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search description or reference"
          aria-label="Search transactions"
          className="w-full"
        />

        <Select defaultValue="all">
          <SelectTrigger
            aria-label="Filter transactions"
            className="w-full sm:w-fit"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {wallet.transactions.map((transaction) => (
        <div
          key={transaction.title}
          className="flex items-center justify-between border-b border-border-subtle pb-3"
        >
          <div className="flex items-center gap-3">
            {transaction.type === 'buy' ? (
              <ArrowDownLeft className="size-5 text-text-secondary" />
            ) : (
              <ArrowUpRight className="size-5 text-text-secondary" />
            )}

            <div>
              <p className="text-text-primary">{transaction.title}</p>

              <p className="text-caption text-text-secondary">
                {transaction.date}
              </p>
            </div>
          </div>

          <p
            className={
              transaction.type === 'buy'
                ? 'text-text-primary'
                : 'text-feedback-success-text'
            }
          >
            {transaction.amount}
          </p>
        </div>
      ))}
    </Card>
  )
}
