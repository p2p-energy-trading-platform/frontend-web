import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '@/components/landing/HeroSection'


export const Route = createFileRoute('/')({
    component: Home,
})


function Home() {

  return (
    <main>

      <HeroSection />

    </main>
  )
}