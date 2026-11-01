import { MARKET_LOCALE } from '#/data/currency';

function formatOneDecimal(value: number) {
  return value.toLocaleString(MARKET_LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** Power in kW, e.g. "3.8"; sign "always" adds "+" to positive values. */
export function formatKw(value: number, sign: 'auto' | 'always' = 'auto') {
  const body = formatOneDecimal(value);
  return sign === 'always' && value > 0 ? `+${body}` : body;
}

/** Energy in kWh, e.g. "1,234.5". */
export function formatKwh(value: number) {
  return formatOneDecimal(value);
}

/** Percentage without the % sign, e.g. "81.7". */
export function formatPercent(value: number) {
  return formatOneDecimal(value);
}

export function formatRelativeTime(iso: string, now: Date) {
  const seconds = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86_400)} d ago`;
}
