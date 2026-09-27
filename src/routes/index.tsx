import { createFileRoute } from '@tanstack/react-router'
import HowItWorksSection from '#/components/landing/HowItWorksSection'
import HeroSection from '#/components/landing/HeroSection'
import BenifitsSection from '#/components/landing/BenefitsHeader'
import AssetsSection from '#/components/landing/AssetSection'
import FAQSection from '#/components/landing/FAQSection'
import CTASection from '#/components/landing/CTASection'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <HeroSection />

      <HowItWorksSection />

      <BenifitsSection />

      <AssetsSection />

      <FAQSection />

      <CTASection />
    </main>
  )
}
