const points = '0,142 90,148 150,150 210,142 290,88 355,124 430,148 500,143 610,98 675,57 790,31 900,114'


export default function ForecastChart() {

    return (
        <section className="overflow-hidden rounded-xl border border-border-default bg-background-surface">
            
            <div className="flex flex-col justify-between gap-3 border-b border-border-default p-5 md:flex-row md:items-center">
                
                <div>

                    <h2 className="text-heading-4 text-text-primary">
                        Price forecast · 17 Jul 2025 · 00:00–23:30 GST
                    </h2>

                    <p className="mt-1 text-caption text-text-secondary">
                        Shaded band = confidence interval · Vertical marker = current
                        time
                    </p>

                </div>

                <div className="flex gap-4 text-caption text-text-tertiary">
                    
                    <span>Forecast</span>
                    <span>Observed</span>
                    <span>Confidence band</span>

                </div>

            </div>

            <div className="flex h-72 p-5">

                <div className="flex w-10 flex-col justify-between pb-8 text-caption text-text-tertiary">
                    
                    <span>0.47</span>
                    <span>0.30</span>
                    <span>0.15</span>
                    <span>0.00</span>

                </div>

                <div className="relative flex-1">
                    
                    <div className="absolute inset-0 bottom-8 flex flex-col justify-between">
                        
                        <div className="border-t border-border-subtle" />
                        <div className="border-t border-border-subtle" />
                        <div className="border-t border-border-subtle" />
                        <div className="border-t border-border-subtle" />

                    </div>

                    <svg
                        viewBox="0 0 900 220"
                        preserveAspectRatio="none"
                        className="absolute inset-x-0 top-0 h-[calc(100%-32px)] w-full"
                    >

                        <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-action-accent"
                        />

                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-caption text-text-tertiary">
                        
                        <span>00:00</span>
                        <span>04:00</span>
                        <span>08:00</span>
                        <span>12:00</span>
                        <span>16:00</span>
                        <span>20:00</span>
                        <span>23:30</span>

                    </div>

                </div>

            </div>

        </section>
    )


}