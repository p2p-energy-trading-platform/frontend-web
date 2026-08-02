import { Card } from '@/components/ui/card'

export default function AssetsCard() {
  return (
    <div className="py-6 flex flex-row justify-center gap-6">
      <Card className="w-64 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 items-center">
            <img
              src="/images/sun.png"
              alt="Connect your meter via the GridX app using your Dubai address and meter number"
              className="size-12 object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-foreground">Rooftop Solar PV</h3>
          </div>

          <p className="text-text-secondary text-sm">
            List surplus kWh from your photovoltaic installation. Any rooftop
            system from 2 kW and above is eligible.
          </p>
        </div>
      </Card>

      <Card className="w-64 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 items-center">
            <img
              src="/images/battery.png"
              alt="Verify your account information in the GridX app"
              className="size-12 object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-foreground">Battery Storage</h3>
          </div>

          <p className="text-text-secondary text-sm">
            Export stored energy during peak demand hours for maximum return.
            Charge during low-cost periods, sell during price spikes.
          </p>
        </div>
      </Card>

      <Card className="w-64 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 items-center">
            <img
              src="/images/car.png"
              alt="Trade energy with other users in the GridX app"
              className="size-12 object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-label-lg text-foreground">
              EV Vehicle-to-Grid
            </h3>
          </div>

          <p className="text-text-secondary text-sm">
            Turn your electric vehicle into a household grid asset. Export from
            your EV's battery when you're parked at home.
          </p>
        </div>
      </Card>
    </div>
  )
}
