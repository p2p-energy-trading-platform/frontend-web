import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowRight } from 'lucide-react'

function HeroContent() {
  return (
    <div>
      <Badge variant="secondary" className="mt-10">
        ⚡Live Energy Marketplace
      </Badge>

      <h1 className="mt-4 text-display-xl text-foreground">
        <span className="block">Turn Your Energy</span>

        <span className="block text-accent ml-2">into Shared Value</span>
      </h1>

      <p className="mt-7 ml-2 text-text-secondary max-w-xl">
        Buy surplus solar, battery, or EV energy directly from <br />
        households in your Dubai grid zone — or sell what you <br />
        generate at a fair price to neighbours who need it.
      </p>

      <div className="mt-7 ml-2 flex flex-wrap items-center justify-start gap-4">
        <Link to="/sign-in" className={buttonVariants({ size: 'lg' })}>
          Start Trading Energy
          <ArrowRight />
        </Link>

        <Button variant="outline" className="border-primary" size="lg">
          See How It Works
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        <div className="mt-6 flex items-center gap-2">
          <Check className="h-4 w-4 text-feedback-success-icon" />

          <span className="text-xs text-muted-foreground/70">
            No lock-in contracts
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Check className="h-4 w-4 text-feedback-success-icon" />

          <span className="text-xs text-muted-foreground/70">
            AED wallet, instant settlement
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Check className="h-4 w-4 text-feedback-success-icon" />

          <span className="text-xs text-muted-foreground/70">
            Smart-meter verified
          </span>
        </div>
      </div>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="">
      <img
        src="/images/gridx-energy-ecosystem.png"
        alt="GridX energy ecosystem connecting solar, battery, EV and smart homes"
      />
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="bg-background flex flex-row justify-center gap-20">
      <HeroContent />

      <HeroVisual />
    </section>
  )
}
