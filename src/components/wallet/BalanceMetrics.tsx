import { ArrowDownLeft, Clock, Lock } from 'lucide-react'

import { BalanceMetricCard } from './BalanceMetricCard'


export function BalanceMetrics() {

  return (

    <div className="border border-red-500 flex flex-row items-center justify-between gap-2">

        <BalanceMetricCard
            icon={Clock}
            title="PENDING"
            amount="AED 7.74"
            description="Setting"
        />


        <BalanceMetricCard
            icon={Lock}
            title="RESERVED"
            amount="AED 2.13"
            description="Open orders"
        />


        <BalanceMetricCard
            icon={ArrowDownLeft}
            title="LIFETIME IN"
            amount="AED 1,284.50"
            description="All deposits"
        />

    </div>

  )

}