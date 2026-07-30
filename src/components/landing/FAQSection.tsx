import { ChevronDown } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Card } from '../ui/card'

export default function FAQSection() {
  return (
    <section className="border border-red-500 bg-bg-surface flex flex-col items-center justify-center">

        <div className="py-10 flex flex-col gap-5 items-center text-center">
            <Badge variant="secondary">FAQ</Badge>

            <h2 className="text-heading-1 text-foreground">
                Frequently asked questions
            </h2>

            <p className="text-heading-4 text-text-secondary">
                Can't find your answer?{' '}
                <span className="text-brand-accent text-caption">
                    Contact us
                </span>
            </p>
        </div>

        <div className="py-5 flex flex-col gap-4 w-full max-w-xl">

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        Is GridX the same as net metering or DEWA feed-in?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />

                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        DO I need any new hardware or equipment?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />

                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        How are kWh prices determined on the marketplace?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        Which Dubai grid zones are currently supported?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />

                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        How quickly do I receive payment after a trade  settles?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />

                </div>                
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between">

                    <h3 className="text-label-lg text-foreground">
                        Is my energy data and personal information secure?
                    </h3>
                    <ChevronDown className="size-5 text-text-secondary" />

                </div>                
            </Card>

        </div>
      
    </section>
  )
}