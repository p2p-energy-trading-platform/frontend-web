import { useState } from 'react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { BarChart3, Check, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react'


const trustItems = [
  {
    title: 'Smart-meter verified',
    description:
      'Every trade is settled against certified smart-meter readings. No estimates, no self-reported figures.',
    icon: ShieldCheck,
  },
  {
    title: 'Transparent grid fees',
    description:
      'Network transmission and platform settlement fees are itemised on every transaction receipt.',
    icon: BarChart3,
  },
  {
    title: 'Escrow-secured payments',
    description:
      'AED funds are held in escrow until metered delivery is confirmed. Buyers are protected if delivery falls short.',
    icon: LockKeyhole,
  },
  {
    title: 'Identity verified users',
    description:
      'All participants complete document identity verification and meter-ownership checks before their first trade.',
    icon: CheckCircle2,
  },
]


export default function TrustSection() {

  const [activeCard, setActiveCard] = useState<string | null>(null)


  return (
    <section className="bg-background flex flex-row items-center justify-start gap-6 px-9">

        <div className="py-6 flex flex-col gap-5 items-start text-center">
            <Badge variant="secondary" className="">Trust & safety</Badge>

            <h2 className="text-display-lg text-foreground text-left">
                Built on verified data, not promises
            </h2>

            <p className="text-label-md text-text-secondary tracking-tight text-left">
                GridX is designed around metered proof. Every kilowatt-hour is accounted for, every payment is protected, and every participant is verified.
            </p>

            <div className="w-full flex flex-col items-start justify-center gap-3">

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-action-accent" />

                    <span className="text-xs text-text-secondary">
                        ISO 27001-aligned data security
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-action-accent" />

                    <span className="text-xs text-text-secondary">
                        AES-256 encryption at rest and in transit
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-action-accent" />

                    <span className="text-xs text-text-secondary">
                        Audit trail on every trade
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6">
          
          {trustItems.map(({ title, description, icon: Icon }) => {

              const isActive = activeCard === title

              return (

                <Card 
                  key={title} 
                  className={`flex min-h-52 cursor-pointer flex-col items-start p-5 text-left transition-all ${
                      isActive
                        ? 'border-action-accent bg-background-surface'
                        : 'border-border-default bg-background-surface hover:border-border-strong hover:bg-muted'
                    }`}
                    onClick={() => setActiveCard(isActive ? null : title)}
                    aria-pressed={isActive}
                >

                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-action-accent'
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="mt-5 text-heading-4 text-text-primary">
                    {title}
                  </h3>

                  <p className="mt-2 text-label-lg text-text-secondary">
                    {description}
                  </p>

                </Card>

              )
              
          })}

        </div>

    </section>
  )
}   