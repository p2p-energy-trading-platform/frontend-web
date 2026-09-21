import type { CardBrand } from './paymentMethodData'

export function CardLogo({ brand }: { brand: CardBrand }) {
  const colors: Record<CardBrand, string> = {
    visa: 'text-chart-2',
    mastercard: 'text-feedback-error-text',
    amex: 'text-primary',
  }

  const labels: Record<CardBrand, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX',
  }

  return (
    <span className={`text-label-sm ${colors[brand]}`}>{labels[brand]}</span>
  )
}
