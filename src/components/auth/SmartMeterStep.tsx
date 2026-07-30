import * as React from 'react'
import {
  Check,
  Gauge,
  LoaderCircle,
  MapPin,
  RadioTower,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export type SmartMeterStatus = 'connected' | 'skipped'

interface SmartMeterStepProps {
  onComplete: (status: SmartMeterStatus) => Promise<void> | void
}

const GRID_ZONES = Array.from({ length: 16 }, (_, index) => index + 1)

export function SmartMeterStep({ onComplete }: SmartMeterStepProps) {
  const [meterNumber, setMeterNumber] = React.useState('')
  const [gridZone, setGridZone] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isFormValid = meterNumber.trim().length >= 6 && Boolean(gridZone)

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

    if (!isFormValid) {
      return
    }

    await complete('connected')
  }

  const inputClassName =
    'h-12 rounded-2xl border-input bg-secondary px-4 text-sm text-foreground shadow-none placeholder:text-text-disabled focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20'

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            Final onboarding step
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
        Add your meter to receive live energy readings and start trading in your
        grid zone. You can also complete this later from Settings.
      </p>

      <form onSubmit={handleSubmit} className="mt-7">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="meterNumber"
              className="block text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
            >
              Smart meter number
            </label>
            <Input
              id="meterNumber"
              autoComplete="off"
              placeholder="Enter the number shown on your meter"
              value={meterNumber}
              onChange={(event) => setMeterNumber(event.target.value)}
              aria-describedby="meterNumber-help"
              className={inputClassName}
            />
            <p
              id="meterNumber-help"
              className="text-[11px] leading-4 text-text-disabled"
            >
              Usually printed below the barcode on the front of your device.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="gridZone"
              className="block text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
            >
              Grid zone
            </label>
            <div className="relative">
              <select
                id="gridZone"
                value={gridZone}
                onChange={(event) => setGridZone(event.target.value)}
                className={`${inputClassName} w-full appearance-none pr-10 outline-none ${
                  gridZone ? '' : 'text-text-disabled'
                }`}
              >
                <option value="">Select your Dubai grid zone</option>
                {GRID_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    Zone {zone}
                  </option>
                ))}
              </select>
              <MapPin className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-disabled" />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex gap-3">
            <RadioTower className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Secure connection check</p>
              <p className="mt-1 text-xs leading-5 text-text-tertiary">
                GridX verifies the meter number and confirms that it belongs to
                the selected zone. No settings on your meter are changed.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="mt-6 h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/30 disabled:text-text-tertiary"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Connecting…
            </>
          ) : (
            <>
              Connect Smart Meter
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
          Set up later
        </Button>
      </form>
    </div>
  )
}
