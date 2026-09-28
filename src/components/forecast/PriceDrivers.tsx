import { Activity, Sun, Thermometer, Wifi } from 'lucide-react'

const drivers = [
  {
    icon: Sun,
    title: 'Solar generation',
    value: 'Strong',
    description:
      'Peak output 09:00–15:00 GST expected to suppress midday prices below average.',
  },
  {
    icon: Activity,
    title: 'Grid demand',
    value: 'High',
    description:
      'Cooling load peaks 17:00–20:00 GST — primary driver of the evening price surge.',
  },
  {
    icon: Thermometer,
    title: 'Temperature',
    value: '42 °C',
    description:
      'Above seasonal average. Elevated A/C demand expected throughout the day.',
  },
  {
    icon: Wifi,
    title: 'Grid conditions',
    value: 'Normal',
    description:
      'No planned maintenance. Network congestion low across JLT Zone 4.',
  },
]


export default function PriceDrivers() {

    return (
        <section className="rounded-xl border border-border-default bg-background-surface p-5">
            
            <h2 className="text-heading-4 text-text-primary">Key price drivers</h2>

            <p className="mt-1 text-caption text-text-secondary">
                Factors informing today&apos;s forecast
            </p>

            <div className="mt-5 flex flex-col gap-5">
                
                {drivers.map((driver) => {
                
                    const Icon = driver.icon

                    return (

                        <div key={driver.title} className="flex gap-3">

                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-well text-action-accent">
                                <Icon size={16} />
                            </span>

                            <div>

                                <strong className="text-label-lg text-text-primary">
                                    {driver.title}
                                </strong>

                                <span className="ml-2 text-caption text-action-accent">
                                    {driver.value}
                                </span>

                                <p className="mt-1 text-caption text-text-secondary">
                                    {driver.description}
                                </p>

                            </div>

                        </div>
                    )

                })}
                
            </div>
            
        </section>
    )

}