import {
  aboutPage,
  buyerBenefits,
  heroChecks,
  prosumerBenefits,
} from '#/data/marketing'

export function useMarketing() {
  return {
    source: 'demo' as const,
    heroChecks,
    buyerBenefits,
    prosumerBenefits,
    about: aboutPage,
  }
}
