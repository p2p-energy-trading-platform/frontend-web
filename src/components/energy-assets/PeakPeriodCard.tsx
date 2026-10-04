import { Card } from '#/components/ui/card';
import { usePeakPeriods } from '#/hooks/useEnergyAssets';
import { cn } from 'cn';

export interface PeakPeriodsCardProps {
  /** 7 rows (Mon-Sun) x N hourly columns, each 0-1 intensity */
  matrix?: Array<Array<number>>;
  hourLabels?: Array<string>;
}

function intensityClass(v: number) {
  if (v > 0.66) return 'bg-accent';
  if (v > 0.33) return 'bg-accent/50';
  return 'bg-accent/15';
}

export function PeakPeriodsCard({ matrix, hourLabels }: PeakPeriodsCardProps) {
  const peak = usePeakPeriods();
  const cells = matrix ?? peak.matrix;
  const hours = hourLabels ?? peak.hourLabels;
  const days = peak.days;
  return (
    <Card className="gap-4 border-border-subtle bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-heading-4 text-text-primary">Peak usage periods</h3>
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <Legend colorClass="bg-accent/15" label="Low" />
          <Legend colorClass="bg-accent/50" label="Mid" />
          <Legend colorClass="bg-accent" label="Peak" />
        </div>
      </div>

      <div>
        <div
          className="mb-1 grid gap-1 pl-8 text-sm text-text-tertiary"
          style={{ gridTemplateColumns: `repeat(${hours.length}, 1fr)` }}
        >
          {hours.map((h) => (
            <span key={h} className="text-center">
              {h}
            </span>
          ))}
        </div>

        <div className="space-y-1">
          {days.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-caption text-text-tertiary">
                {day}
              </span>
              <div className="grid flex-1 grid-flow-col gap-1">
                {cells[dayIdx].map((v, hourIdx) => (
                  <div
                    key={hourIdx}
                    className={cn('h-4 rounded-sm', intensityClass(v))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-text-tertiary">
          Hourly consumption kW · this week
        </p>
      </div>
    </Card>
  );
}

function Legend({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2.5 rounded-sm', colorClass)} />
      {label}
    </span>
  );
}
