import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'

function CTAActions() {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <Button size="lg">
        Start trading Energy
        <ArrowRight />
      </Button>

      <Button variant="outline" className="border-primary" size="lg">
        Request demo
      </Button>
    </div>
  )
}

function CTAHeader() {
  return (
    <div className="py-6 mb-10 flex flex-col gap-5 items-center text-center">
      <Badge variant="secondary">Join 3,412 households already trading</Badge>

      <h2 className="text-display-lg text-foreground">
        Join Dubai's growing energy network
      </h2>

      <p className="text-label-lg text-text-secondary">
        Start trading in minutes. No contracts, no setup fees, no special
        <br />
        hardware.
      </p>
    </div>
  )
}

export default function CTASection() {
  return (
    <section className="bg-card flex flex-row justify-center gap-20 py-25">
      <Card className="bg-background w-full max-w-4xl py-20">
        <CTAHeader />
        <CTAActions />
      </Card>
    </section>
  )
}