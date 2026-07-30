import * as React from 'react'
import {
  Check,
  Gauge,
  LoaderCircle,
  RadioTower,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { SmartMeterStatus } from '#/lib/smart-meter-status'

export type { SmartMeterStatus } from '#/lib/smart-meter-status'

interface SmartMeterStepProps {
  onComplete: (status: SmartMeterStatus) => Promise<void> | void
}

const SMART_METER_ID_PATTERN = /^MTR-[A-Z0-9]{4}-[A-Z0-9]{2}$/

export function SmartMeterStep({ onComplete }: SmartMeterStepProps) {
  const [meterId, setMeterId] = React.useState('')
  const [showValidation, setShowValidation] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isMeterIdValid = SMART_METER_ID_PATTERN.test(meterId)

  async function complete(status: SmartMeterStatus) {
    setIsSubmitting(true)

    try {
      await onComplete(status)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isMeterIdValid) {
      setShowValidation(true)
      return
    }

    await complete('pending')
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            Step 4 · Optional smart meter
          </p>
          <h1 className="mt-1 font-heading text-[26px] font-bold leading-[34px]">
            Connect your smart meter
          </h1>
        </div>

        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
          <Gauge className="size-[22px]" />
        </span>
      </div>

      <p className="mt-2 text-sm leading-[22px] text-text-tertiary">
        Send a secure connection request to your utility, or skip this step and
        connect a meter later from your Profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-7" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="smartMeterId"
            className="block text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
          >
            Smart Meter ID
          </label>
          <Input
            id="smartMeterId"
            autoComplete="off"
            placeholder="MTR-7829-XY"
            value={meterId}
            onChange={(event) => {
              setMeterId(event.target.value.toUpperCase())
              setShowValidation(false)
            }}
            aria-describedby={
              showValidation && !isMeterIdValid
                ? 'smartMeterId-help smartMeterId-error'
                : 'smartMeterId-help'
            }
            aria-invalid={showValidation && !isMeterIdValid}
            className="h-12 rounded-2xl border-input bg-secondary px-4 text-sm text-foreground shadow-none placeholder:text-text-disabled focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
          />
          <p
            id="smartMeterId-help"
            className="text-[11px] leading-4 text-text-disabled"
          >
            Find this ID below the barcode on the front of your meter.
          </p>
          {showValidation && !isMeterIdValid ? (
            <p
              id="smartMeterId-error"
              role="alert"
              className="text-xs text-[var(--feedback-error-text)]"
            >
              Enter an ID in the format MTR-7829-XY.
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex gap-3">
            <RadioTower className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Secure approval request</p>
              <p className="mt-1 text-xs leading-5 text-text-tertiary">
                GridX sends an approval request to your utility app. Meter
                access remains read-only, and no device settings are changed.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!meterId || isSubmitting}
          className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/30 disabled:text-text-tertiary"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Sending request…
            </>
          ) : (
            <>
              Send Connection Request
              <Check className="size-4" />
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={() => complete('skipped')}
          className="mt-4 h-auto w-full gap-1.5 p-0 text-sm font-medium text-text-tertiary hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck className="size-4" />
          Skip for Now
        </Button>
      </form>
    </div>
  )
}
