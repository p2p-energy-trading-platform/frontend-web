import { Button } from '#/components/ui/button'


export default function ForecastFilters() {

    return (
        <div className="flex flex-wrap items-end gap-4">

            <label className="flex min-w-44 flex-col gap-2">
                
                <span className="text-label-sm text-text-secondary">PROPERTY</span>

                <select className="rounded-lg border border-border-default bg-background-surface px-3 py-2.5 text-label-lg text-text-primary outline-none">
                    <option>Villa 47</option>
                </select>

            </label>

            <label className="flex min-w-40 flex-col gap-2">
                
                <span className="text-label-sm text-text-secondary">GRID ZONE</span>

                <select className="rounded-lg border border-border-default bg-background-surface px-3 py-2.5 text-label-lg text-text-primary outline-none">
                    <option>JLT Zone 4</option>
                </select>

            </label>

            <label className="flex min-w-52 flex-col gap-2">
                <span className="text-label-sm text-text-secondary">
                    FORECAST ISSUED
                </span>

                <select className="rounded-lg border border-border-default bg-background-surface px-3 py-2.5 text-label-lg text-text-primary outline-none">
                    <option>17 Jul 2025 · 08:30 GST</option>
                </select>
                
            </label>

            <Button variant="outline" size="lg">
                Observed overlay on
            </Button>

        </div>
    )

}