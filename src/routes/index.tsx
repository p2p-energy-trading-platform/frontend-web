import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/components/landing/hero-section/HeroSection'
import HowItWorksSection from '@/components/landing/howitworks-section/HowItWorksSection'
import BenifitsSection from '@/components/landing/benifits-section/BenefitsSection'
import StatSection from '@/components/landing/stats-section/StatSection'
import AssetsSection from '@/components/landing/asssets-section/AssetsSection'
import TrustSection from '@/components/landing/trust-section/TrustSection'
import SustainabilitySection from '@/components/landing/sustainability-section/SustainabilitySection'
import FAQSection from '@/components/landing/faq-section/FAQSection'
import CTASection from '@/components/landing/cta-section/CTASection'
import FooterSection from '@/components/landing/footer-section/FooterSection'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <HeroSection />

      <HowItWorksSection />

      <BenifitsSection />

      <StatSection />

      <AssetsSection />

      <TrustSection />

      <SustainabilitySection />

      <FAQSection />

      <CTASection />

      <FooterSection />
    </main>
  )
}
