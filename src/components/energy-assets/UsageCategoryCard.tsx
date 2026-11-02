import { EChart } from '#/components/charts/EChart';
import { resolveCssColor, useChartColors } from '#/components/charts/theme';
import { Badge } from '#/components/ui/badge';
import { Card } from '#/components/ui/card';
import { usageDonutOption } from '#/features/iot/chart-options';

export interface UsageCategory {
  label: string;
  valueKwh: number;
  colorClass: string;
  /** stroke color used in the donut segment, e.g. 'var(--action-accent)' */
  strokeColor: string;
}

export function UsageCategoryCard({
  categories,
}: {
  categories: Array<UsageCategory>;
}) {
  const maxValue = Math.max(...categories.map((c) => c.valueKwh));
  const colors = useChartColors();
  const option = usageDonutOption(
    categories.map((c) => ({
      label: c.label,
      valueKwh: c.valueKwh,
      color: resolveCssColor(c.strokeColor),
    })),
    colors,
  );

  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">Usage by category</h3>
        <Badge
          variant="outline"
          className="border-border-subtle text-text-tertiary"
        >
          Today
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        <EChart
          option={option}
          ariaLabel="Energy use by category"
          className="size-28 shrink-0"
        />

        <div className="min-w-0 flex-1 space-y-3">
          {categories.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-primary">
                  <span className={`size-2 rounded-full ${c.colorClass}`} />
                  {c.label}
                </span>
                <span className="font-mono text-text-secondary">
                  {c.valueKwh.toFixed(1)} kWh
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${c.colorClass}`}
                  style={{ width: `${(c.valueKwh / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
