import { useMemo, useState } from 'react';

import { MARKET_TIME_ZONE } from '#/data/currency';
import type { EnergySeriesRange } from '#/features/iot/api';
import {
  canShiftForward,
  rangeFor,
  shiftAnchor,
} from '#/features/iot/time-range';
import type { CustomDates, EnergyPeriod } from '#/features/iot/time-range';

/** Period toggle, date navigation and custom dates for the Energy page. */
export function useEnergyPeriod() {
  const [period, setPeriod] = useState<EnergyPeriod>('Day');
  const [anchor, setAnchor] = useState(() => new Date());
  const [custom, setCustom] = useState<CustomDates>();

  const resolved = useMemo(
    () => rangeFor(period, anchor, MARKET_TIME_ZONE, custom),
    [period, anchor, custom],
  );
  const range = useMemo(
    (): EnergySeriesRange => ({
      from: resolved.from,
      to: resolved.to,
      bucket: resolved.bucket,
      timeZone: MARKET_TIME_ZONE,
    }),
    [resolved],
  );

  return {
    period,
    setPeriod: (next: EnergyPeriod) => {
      setPeriod(next);
      if (next !== 'Custom') setAnchor(new Date());
    },
    custom,
    setCustom,
    range,
    label: resolved.label,
    previous: () => setAnchor((current) => shiftAnchor(period, current, -1)),
    next: () => setAnchor((current) => shiftAnchor(period, current, 1)),
    nextDisabled: !canShiftForward(
      period,
      anchor,
      new Date(),
      MARKET_TIME_ZONE,
    ),
  };
}
