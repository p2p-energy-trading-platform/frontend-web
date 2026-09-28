import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'


export default function StatSection() {
  return (
    <section className="pb-9 bg-background flex flex-col items-center justify-center">

        <div className="py-6 flex flex-col gap-5 items-center text-center">
            <Badge variant="secondary" className="">LIVE MARKETPLACE DATA</Badge>

            <h2 className="text-section-title text-foreground">
                Dubai's energy network, growing daily
            </h2>

            <p className="text-label-lg text-text-secondary">
                Real figures from the GridX trading network. Updated every hour.
            </p>
        </div>


        <div className="grid grid-cols-3 gap-3 mt-8">
          
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
                61, 840kWh
              </strong>

              <span className="text-label-lg text-text-secondary">
                Traded this month
              </span>

              <span className="text-caption">
                July 2025
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                AED 0.34
              </strong>

              <span className="text-label-lg text-text-secondary">
                Typical price range
              </span>

              <span className="text-caption">
                per kWh, zone-dependent
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                AED 284 avg/month
              </strong>

              <span className="text-label-lg text-text-secondary">
                Prosumer monthly earnings
              </span>

              <span className="text-caption">
                solar PV sellers
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                4 . 1 min
              </strong>

              <span className="text-label-lg text-text-secondary">
                Average settlement time
              </span>

              <span className="text-caption">
                after delivery confirmation
              </span>
            </div>
          </Card>

          <Card className="w-94 bg-background-surface border-border-default p-5">
            <div className="flex flex-col gap-3 my-2">
              <strong className="text-3xl font-semibold text-foreground">
                16 zones
              </strong>

              <span className="text-label-lg text-text-secondary">
                Dubai grid zones covered
              </span>

              <span className="text-caption">
                expanding quarterly
              </span>
            </div>
          </Card>

        </div>      

    </section>
  )
}
