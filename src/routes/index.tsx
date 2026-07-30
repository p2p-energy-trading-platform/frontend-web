import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '#/components/landing/HowItWorksSection'
import FeaturesSection from '#/components/landing/FeaturesSection'
import FAQSection from '@/components/landing/FAQSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <HeroSection />

      <HowItWorksSection />

      <FeaturesSection />

      <FAQSection />
    </main>
  )
}
