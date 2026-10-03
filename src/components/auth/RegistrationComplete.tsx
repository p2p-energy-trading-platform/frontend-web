import { Check, IdCard, RadioTower } from 'lucide-react'
import type { KycStatus, SmartMeterStatus } from './types'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '../ui/button'
import { cn } from 'cn'

export default function RegistrationComplete({
  kycStatus,
  meterStatus,
}: {
  kycStatus: KycStatus
  meterStatus: SmartMeterStatus
}) {
  return (
    <div>
      <div className="flex size-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent">
        <Check className="size-7" />
      </div>

      <p className="mt-5 text-caption font-bold uppercase tracking-widest text-accent">
        Onboarding complete
      </p>

      <h1 className="mt-2 font-heading text-heading-1 font-bold leading-tight">
        Registration saved
      </h1>

      <p className="mt-3 text-sm leading-6 text-text-tertiary">
        Your email is verified and your onboarding choices have been saved. You
        can update identity or smart meter details from your account later.
      </p>

      <div className="mt-7 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
            <IdCard className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-text-tertiary">
              Identity status
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {kycStatus === 'pending' ? 'Pending' : 'Not submitted'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
            <RadioTower className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-text-tertiary">
              Smart meter
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {meterStatus === 'pending' ? 'Pending' : 'Skipped'}
            </p>
          </div>
        </div>
      </div>
      <Link
        to="/profile"
        className={cn(
          buttonVariants({ variant: 'default' }),
          'mt-6 h-12 w-full rounded-xl',
        )}
        // className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-foreground transition hover:bg-accent/90"
      >
        View Profile
      </Link>
    </div>
  )
}
