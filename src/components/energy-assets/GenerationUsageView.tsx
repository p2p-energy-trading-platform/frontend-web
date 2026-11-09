import { EnergyBalanceCard } from '#/components/energy-assets/EnergyBalanceCard';
import { EnergyKpiStrip } from '#/components/energy-assets/EnergyKPIStrip';
import { EnergyTimeSeriesChart } from '#/components/energy-assets/EnergySeriesChart';
import { EnergyDateBar } from '#/components/energy-assets/EnergyStatBar';
import { CustomRangeForm } from '#/components/energy-assets/CustomRangeForm';
import { ForecastCard } from '#/components/energy-assets/ForecastCard';
import { InsightsPanel } from '#/components/energy-assets/InsightsPanel';
import { PeakPeriodsCard } from '#/components/energy-assets/PeakPeriodCard';
import { UsageCategoryCard } from '#/components/energy-assets/UsageCategoryCard';
import { IotDataState } from '#/components/page-components/IotDataState';
import { Card } from '#/components/ui/card';
import { seriesToCsv } from '#/features/iot/view-model';
import {
  useEnergyMeta,
  useEnergyOverview,
  useEnergySamples,
  useEnergySeriesData,
} from '#/hooks/useEnergyAssets';
import { useEnergyPeriod } from '#/hooks/useEnergyPeriod';
import { downloadText } from '#/lib/download';

export function GenerationUsageView() {
  const meta = useEnergyMeta();
  const period = useEnergyPeriod();
  const overview = useEnergyOverview(period.range);
  const series = useEnergySeriesData(period.range);
  const samples = useEnergySamples();

  return (
    <div className="flex flex-col gap-5">
      <EnergyDateBar
        period={period.period}
        onPeriodChange={period.setPeriod}
        dateLabel={period.label}
        onPrevDate={period.previous}
        onNextDate={period.next}
        nextDisabled={period.nextDisabled}
        zoneLabel={meta.zoneLabel}
        onExportCsv={() =>
          downloadText(
            `energy-${period.range.from.slice(0, 10)}.csv`,
            seriesToCsv(series.buckets),
          )
        }
      />

      {period.period === 'Custom' && (
        <CustomRangeForm value={period.custom} onApply={period.setCustom} />
      )}

      {overview.status === 'ready' ? (
        <EnergyKpiStrip kpis={overview.kpis} />
      ) : (
        <Card className="border-border-subtle bg-card p-5">
          <IotDataState
            status={overview.status}
            onRetry={() => void overview.retry()}
            skeletonClassName="h-20"
          />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_347px]">
        <div className="flex flex-col gap-5">
          <EnergyTimeSeriesChart range={period.range} />
          <ForecastCard />
          <UsageCategoryCard categories={samples.categories} />
          <PeakPeriodsCard />
        </div>

        <div className="flex flex-col gap-5">
          {overview.balance ? (
            <EnergyBalanceCard
              {...overview.balance}
              periodLabel={period.period}
            />
          ) : (
            <Card className="border-border-subtle bg-card p-5">
              <IotDataState
                status={
                  overview.status === 'ready' ? 'loading' : overview.status
                }
                onRetry={() => void overview.retry()}
              />
            </Card>
          )}
          <InsightsPanel
            newCount={samples.insights.length}
            insights={samples.insights}
          />
        </div>
      </div>
    </div>
  );
}
