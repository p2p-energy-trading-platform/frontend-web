export const CURRENCY_CODE = 'AED'
export const MARKET_LOCALE = 'en-AE'
export const MARKET_TIME_ZONE = 'Asia/Dubai'

export function formatAed(
  value: number,
  fractionDigits = 2,
  sign: 'auto' | 'always' | 'never' = 'never',
) {
  const negative = value < 0
  const body = Math.abs(value).toLocaleString(MARKET_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  const prefix = negative ? '-' : sign === 'always' && value > 0 ? '+' : ''
  return `${prefix}${CURRENCY_CODE} ${body}`
}

export function formatAedPerKwh(value: number, fractionDigits = 3) {
  return `${formatAed(value, fractionDigits)}/kWh`
}
