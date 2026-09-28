import { ArrowDownRight, ArrowUpRight, Info, Sun } from 'lucide-react'

const insights = [
  {
    icon: ArrowUpRight,
    text: 'Best sell window is 18:00–20:30 GST when evening demand peaks.',
  },
  {
    icon: ArrowDownRight,
    text: 'Cheapest buying opportunity is 02:30–05:00 GST overnight.',
  },
  {
    icon: Sun,
    text: 'Solar surplus softens prices 09:00–13:30 GST.',
  },
  {
    icon: Info,
    text: 'Confidence narrows for slots 6+ hours ahead.',
  },
]


export default function ForecastInsights() {

    return (
        <section className="rounded-xl border border-border-default bg-background-surface">
            
            <h2 className="border-b border-border-default p-5 text-heading-4 text-text-primary">
                Insights
            </h2>

            <div className="flex flex-col gap-4 p-5">
                
                {insights.map((insight) => {
                
                    const Icon = insight.icon

                    return (

                        <div key={insight.text} className="flex gap-3">
                            
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-well text-action-accent">
                                <Icon size={15} />
                            </span>

                            <p className="text-label-lg text-text-secondary">
                                {insight.text}
                            </p>

                        </div>

                    )

                })}

            </div>

        </section>
    )

}