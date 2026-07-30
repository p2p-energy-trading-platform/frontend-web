import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/components/landing/hero-section/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import BenifitsSection from '@/components/landing/benifits-section/BenefitsSection'
import FAQSection from '@/components/landing/faq-section/FAQSection'


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
    </main>
  )
}
