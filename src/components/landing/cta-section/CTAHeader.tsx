import { Badge } from '@/components/ui/badge'

export function CTAHeader() {
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
