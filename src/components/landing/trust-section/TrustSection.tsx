import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Check } from 'lucide-react'


export default function TrustSection() {
  return (
    <section className="border border-red-500 bg-background flex flex-row items-center justify-start gap-6 px-6">

        <div className="border border-blue-500 py-6 flex flex-col gap-5 items-center text-center">
            <Badge variant="secondary" className="">Trust & safety</Badge>

            <h2 className="text-display-lg text-foreground">
                Built on verified data, not promises
            </h2>

            <p className="text-label-md text-text-secondary tracking-tight">
                GridX is designed around metered proof. Every kilowatt-hour is accounted for, every payment is protected, and every participant is verified.
            </p>

            <div className="border border-green-500 flex flex-col items-start justify-center gap-3">

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />

                    <span className="text-xs text-muted-foreground/70">
                        ISO 27001-aligned data security
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />

                    <span className="text-xs text-muted-foreground/70">
                        AES-256 encryption at rest and in transit
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />

                    <span className="text-xs text-muted-foreground/70">
                        Audit trail on every trade
                    </span>
                </div>
            </div>
        </div>

        <div className="border border-pink-500 py-6 flex flex-col gap-5 items-center text-center">
          
          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                3, 412
              </strong>

              <span className="text-label-lg text-text-secondary">
                Active  prosumers
              </span>

              <span className="text-caption">
                across 16 zones
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                3, 412
              </strong>

              <span className="text-label-lg text-text-secondary">
                Active  prosumers
              </span>

              <span className="text-caption">
                across 16 zones
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                3, 412
              </strong>

              <span className="text-label-lg text-text-secondary">
                Active  prosumers
              </span>

              <span className="text-caption">
                across 16 zones
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                3, 412
              </strong>

              <span className="text-label-lg text-text-secondary">
                Active  prosumers
              </span>

              <span className="text-caption">
                across 16 zones
              </span>
            </div>
          </Card>  

        </div>

    </section>
  )
}   