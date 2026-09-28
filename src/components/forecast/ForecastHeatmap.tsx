import { Button } from '#/components/ui/button'

const slots = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
]

const values = [
  0.288, 0.284, 0.279, 0.278, 0.276, 0.275, 0.274, 0.273, 0.274, 0.276,
  0.278, 0.283, 0.292, 0.305, 0.321, 0.331, 0.338, 0.342, 0.337, 0.327,
  0.317, 0.31, 0.304, 0.3,
]


export default function ForecastHeatmap() {

    return(
        <section className="overflow-hidden rounded-xl border border-border-default bg-background-surface">
            
            <div className="flex flex-col justify-between gap-3 border-b border-border-default p-5 md:flex-row md:items-center">
                
                <div>
                    <h2 className="text-heading-4 text-text-primary">
                        Slot heatmap
                    </h2>

                    <p className="mt-1 text-caption text-text-secondary">
                        Each cell = 30-min delivery slot · Select to trade
                    </p>
                </div>

                <div className="flex gap-4 text-caption text-text-secondary">
                    <span>Cheap</span>
                    <span>Mid</span>
                    <span>High</span>
                    <span>Peak</span>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-4 lg:grid-cols-6">
                
                {slots.map((slot, index) => {
                
                    const value = values[index]

                    return (

                        <Button
                            key={slot}
                            variant="outline"
                            className="h-auto flex-col items-start gap-1 rounded-lg p-2"
                        >

                            <span className="text-caption text-text-tertiary">
                                {slot}
                            </span>

                            <strong className="text-label-lg text-text-primary">
                                {value.toFixed(3)}
                            </strong>
                            
                        </Button>

                    )

                })}

            </div>

            <p className="pb-4 text-center text-caption text-text-tertiary">
                Select a slot to open the trade terminal
            </p>

        </section>
    )

}