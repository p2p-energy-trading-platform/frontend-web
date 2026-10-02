import * as React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  LoaderCircle,
  MailCheck,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp'

const OTP_LENGTH = 6

interface VerifyEmailStepProps {
  email: string
  onBack: () => void
  onVerified: () => Promise<void> | void
}

export function VerifyEmailStep({
  email,
  onBack,
  onVerified,
}: VerifyEmailStepProps) {
  const [code, setCode] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [resendMessage, setResendMessage] = React.useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (code.length !== OTP_LENGTH) {
      return
    }

    setIsSubmitting(true)

    try {
      await onVerified()
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleResend() {
    setCode('')
    setResendMessage(`A new code was sent to ${email}.`)
  }

  return (
    <div>
      <div className="flex size-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
        <MailCheck className="size-[22px]" />
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
        Email verification
      </p>

      <h1 className="mt-1 font-heading text-[26px] font-bold leading-[34px]">
        Verify your email
      </h1>

      <p className="mt-2 text-sm leading-[22px] text-text-tertiary">
        Enter the verification code sent to
      </p>
      <p className="mt-0.5 break-all text-sm font-semibold text-foreground">
        {email}
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <Field>
          <FieldLabel className="text-xs font-semibold tracking-[0.025em] text-muted-foreground uppercase">
            6-digit verification code
          </FieldLabel>
          <InputOTP
            maxLength={OTP_LENGTH}
            value={code}
            onChange={setCode}
            disabled={isSubmitting}
            containerClassName="mt-2 justify-center"
            aria-label="6-digit verification code"
          >
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }, (_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-14 text-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Field>

        <div className="mt-4 flex items-center gap-2 text-xs text-text-tertiary">
          <Clock3 className="size-3.5 text-accent" />
          Code expires in 10 minutes
        </div>

        <Button
          type="submit"
          disabled={code.length !== OTP_LENGTH || isSubmitting}
          className="mt-7 h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/30 disabled:text-text-tertiary"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify Email
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-tertiary">
        Didn&apos;t receive the verification code?{' '}
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          className="h-auto p-0 font-semibold text-accent"
        >
          Resend
        </Button>
      </p>

      {resendMessage ? (
        <p
          role="status"
          className="mt-2 text-center text-xs text-feedback-success-text"
        >
          {resendMessage}
        </p>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mt-6 h-auto p-0 text-sm font-medium text-text-tertiary hover:bg-transparent hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to account details
      </Button>
    </div>
  )
}
