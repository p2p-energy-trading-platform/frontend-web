const metrics = [
  {
    label: 'DAILY LOW',
    value: '0.274',
    description: 'AED/kWh · Overnight valley',
    valueClass: 'text-action-accent',
  },
  {
    label: 'DAILY HIGH',
    value: '0.432',
    description: 'AED/kWh · Evening demand peak',
    valueClass: 'text-destructive',
  },
  {
    label: 'DAILY AVERAGE',
    value: '0.332',
    description: 'AED/kWh · 24-hour mean',
    valueClass: 'text-text-primary',
  },
  {
    label: 'BEST SELL WINDOW',
    value: '19:00',
    description: 'GST slot · 0.432 AED/kWh',
    valueClass: 'text-action-accent',
  },
  {
    label: 'BEST BUY WINDOW',
    value: '12:30',
    description: 'GST slot · 0.294 AED/kWh',
    valueClass: 'text-blue-500',
  },
]


export default function ForecastMetrics() {

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">

            {metrics.map((metric) => (

                <article
                    key={metric.label}
                    className="flex min-h-24 flex-col justify-between rounded-xl border border-border-default bg-background-surface p-4"
                >
                    
                    <span className="text-label-sm text-text-tertiary">
                        {metric.label}
                    </span>

                    <strong className={`text-heading-2 font-semibold ${metric.valueClass}`}>
                        {metric.value}
                    </strong>

                    <span className="text-caption text-text-secondary">
                        {metric.description}
                    </span>

                </article>

            ))}

        </div>
    )

}