import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HowItWorksSection() {
  return (
    <section className="bg-background flex flex-col items-center justify-center">
      <div className="py-6 flex flex-col gap-5 items-center text-center">
        <Badge variant="secondary" className="">
          How it works
        </Badge>

        <h2 className="text-section-title text-foreground">
          Trading Energy in Three Steps
        </h2>

        <p className="text-label-lg text-text-secondary">
          No special equipment needed. If your home has a smart meter,
          <br />
          you're ready.
        </p>
      </div>

      <div className="py-6 flex flex-row justify-center gap-6">
        <Card className="w-64 p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <img
                src="/images/connect_your_meter.png"
                alt="Connect your meter via the GridX app using your Dubai address and meter number"
                className="size-12 object-contain"
              />

              <div className="flex flex-col gap-1">
                <span className="text-caption text-text-secondary">
                  STEP 01
                </span>

                <h3 className="text-label-lg text-foreground">
                  Connect Your Meter
                </h3>
              </div>
            </div>

            <p className="text-text-secondary text-sm">
              Link your smart meter via the GridX app using your Dubai address
              and meter number. Setup takes under three minutes.
            </p>
          </div>
        </Card>

        <Card className="w-64 p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <img
                src="/images/verify_your_account.png"
                alt="Verify your account information in the GridX app"
                className="size-12 object-contain"
              />

              <div className="flex flex-col gap-1">
                <span className="text-caption text-text-secondary">
                  STEP 02
                </span>

                <h3 className="text-label-lg text-foreground">
                  Verify Your Account
                </h3>
              </div>
            </div>

            <p className="text-text-secondary text-sm">
              Verify your account information in the GridX app to ensure
              everything is set up correctly.
            </p>
          </div>
        </Card>

        <Card className="w-64 p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <img
                src="/images/trade_energy.png"
                alt="Trade energy with other users in the GridX app"
                className="size-12 object-contain"
              />

              <div className="flex flex-col gap-1">
                <span className="text-caption text-text-secondary">
                  STEP 03
                </span>

                <h3 className="text-label-lg text-foreground">Trade Energy</h3>
              </div>
            </div>

            <p className="text-text-secondary text-sm">
              Trade energy with other users in the GridX app.
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
