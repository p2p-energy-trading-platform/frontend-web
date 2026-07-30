import * as React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  LoaderCircle,
  MailCheck,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

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
  const [digits, setDigits] = React.useState(() =>
    Array<string>(OTP_LENGTH).fill(''),
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [resendMessage, setResendMessage] = React.useState('')
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  const code = digits.join('')

  function applyDigits(startIndex: number, value: string) {
    const numericValue = value.replace(/\D/g, '')

    if (!numericValue) {
      setDigits((current) => {
        const next = [...current]
        next[startIndex] = ''
        return next
      })
      return
    }

    setDigits((current) => {
      const next = [...current]

      numericValue
        .slice(0, OTP_LENGTH - startIndex)
        .split('')
        .forEach((digit, offset) => {
          next[startIndex + offset] = digit
        })

      return next
    })

    const nextIndex = Math.min(startIndex + numericValue.length, OTP_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
    inputRefs.current[nextIndex]?.select()
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pastedCode = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)

    if (!pastedCode) {
      return
    }

    event.preventDefault()
    applyDigits(0, pastedCode)
  }

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
    setDigits(Array<string>(OTP_LENGTH).fill(''))
    setResendMessage(`A new code was sent to ${email}.`)
    inputRefs.current[0]?.focus()
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
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground">
            6-digit verification code
          </legend>

          <div
            className="mt-2 flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                aria-label={`Verification code digit ${index + 1}`}
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                autoFocus={index === 0}
                maxLength={1}
                value={digit}
                onChange={(event) => applyDigits(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onFocus={(event) => event.currentTarget.select()}
                disabled={isSubmitting}
                className={cn(
                  'h-14 w-0 min-w-0 flex-1 rounded-2xl border-2 border-input bg-secondary text-center font-mono text-xl font-semibold text-foreground outline-none transition sm:h-16 sm:w-14 sm:flex-none',
                  'focus:border-ring focus:ring-2 focus:ring-ring/20',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            ))}
          </div>
        </fieldset>

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
