export default function ForecastHeader() {

    return (
        <div className="flex items-start justify-between">

            <div>
                <h1 className="text-heading-1 text-text-primary">
                24-Hour Price Forecast
                </h1>

                <p className="mt-1 text-caption text-text-secondary">
                JLT Zone 4 · Gulf Standard Time (UTC+4) · 30-minute delivery slots
                </p>
            </div>

            <span className="rounded-full border border-border-default bg-background-surface px-3 py-2 text-caption text-text-tertiary">
                Updated 08:30 GST · 3h 30m ago
            </span>
            
        </div>
    )

}