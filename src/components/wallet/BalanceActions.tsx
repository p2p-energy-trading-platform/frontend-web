import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { Button } from '#/components/ui/button'


export function BalanceActions() {

  return (

    <div className="border border-red-500 flex flex-row gap-2">

        <Button size="lg" className="px-47 cursor-pointer">
           <ArrowDownLeft />
           Deposit            
        </Button>

        <Button variant="outline" className="px-47 border-primary cursor-pointer" size="lg">
           <ArrowUpRight />
           Withdraw
        </Button>

    </div>

  )
  
}