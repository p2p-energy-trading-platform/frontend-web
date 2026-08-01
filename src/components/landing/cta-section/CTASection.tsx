import { Card } from '@/components/ui/card'
import { CTAHeader } from './CTAHeader'
import { CTAActions } from './CTAActions'

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
