import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/components/landing/hero-section/HeroSection'
import HowItWorksSection from '@/components/landing/howitworks-section/HowItWorksSection'
import BenifitsSection from '@/components/landing/benifits-section/BenefitsSection'
import FAQSection from '@/components/landing/faq-section/FAQSection'
import CTASection from '@/components/landing/cta-section/CTASection'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <HeroSection />

      <HowItWorksSection />

      <BenifitsSection />

      <FAQSection />

      <CTASection />
    </main>
  )
}
