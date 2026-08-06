import type { LucideIcon } from 'lucide-react'

import { Card } from '#/components/ui/card'


type Props = {

  icon: LucideIcon
  title: string
  amount: string
  description: string

}


export function BalanceMetricCard({icon: Icon, title, amount, description}: Props) {

  return (

    <Card className="border border-blue-500 flex flex-col items-start justify-start gap-3 pl-2 pr-48">

        <div className="border border-green-500 flex flex-row items-center justify-start gap-2">

            <Icon className="size-5 text-text-secondary" />

            <h5 className="text-text-secondary">
                {title}
            </h5>

        </div>

        <div className="border border-green-500">

            <h3 className="text-heading-4">{amount}</h3>

        </div>

        <div className="border border-green-500">

            <p className="text-caption text-text-secondary">{description}</p>

        </div>

    </Card>

  )
}