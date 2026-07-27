import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Check,
  Leaf,
  MailCheck,
  ShieldCheck,
  UserRoundPlus,
  WalletCards,
  Zap,
} from 'lucide-react'

import {
  CreateAccountForm,
  type CreateAccountFormData,
} from '#/components/CreateAccountForm'
import { RegistrationStepper } from '#/components/RegistrationStepper'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

const REGISTRATION_STEPS = [
  { id: 1, label: 'Account', description: 'Email & password' },
  { id: 2, label: 'KYC', description: 'Verify your identity' },
  { id: 3, label: 'Smart Meter', description: 'Connect your device' },
]

const ACCOUNT_BENEFITS = [
  { icon: Zap, text: 'Trade energy across 16 Dubai grid zones' },
  { icon: WalletCards, text: 'AED wallet with instant settlement' },
  { icon: ShieldCheck, text: 'Verified prosumer network you can trust' },
  { icon: Leaf, text: 'Measurable sustainability impact' },
  { icon: BarChart3, text: 'Real-time pricing and trade analytics' },
]

function SignUpPage() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState('')

  async function handleCreateAccount(data: CreateAccountFormData) {
    setIsLoading(true)

    try {
      // Replace this delay with the registration API call when the auth API is ready.
      await new Promise((resolve) => window.setTimeout(resolve, 700))
      setUserEmail(data.email)
      setCurrentStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="fixed inset-0 z-[100] min-h-screen overflow-y-auto bg-[#0c1424] text-text-primary">
      <section className="border-b border-border-default bg-[#152035] px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-[1220px]">
          <RegistrationStepper
            steps={REGISTRATION_STEPS}
            currentStep={currentStep}
          />
        </div>
      </section>

      <div className="grid min-h-[calc(100vh-112px)] lg:grid-cols-2">
        <section className="flex justify-center bg-[#0c1424] px-5 py-10 sm:px-10 lg:px-16 lg:py-12">
          <div className="w-full max-w-[460px]">
            {currentStep === 1 ? (
              <>
                <div className="mb-7">
                  <h1 className="font-heading text-[28px] font-bold leading-tight tracking-[-0.02em] text-text-primary">
                    Create your account
                  </h1>
                  <p className="mt-2 text-sm text-text-tertiary">
                    Join GridX and start trading energy with your neighbourhood.
                  </p>
                </div>

                <CreateAccountForm
                  onSuccess={handleCreateAccount}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <VerifyEmailStep
                email={userEmail}
                onBack={() => setCurrentStep(1)}
              />
            )}
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[#080f1e] px-8 py-10 lg:block xl:px-12">
          <div className="absolute left-1/2 top-0 size-[460px] -translate-x-1/2 rounded-full bg-action-accent/10 blur-[100px]" />
          <div className="relative mx-auto flex h-full max-w-[590px] flex-col">
            <GridXBrand />

            <div className="mt-14 flex size-12 items-center justify-center rounded-2xl border border-action-accent/30 bg-action-accent/10 text-action-accent">
              {currentStep === 1 ? (
                <UserRoundPlus className="size-6" />
              ) : (
                <MailCheck className="size-6" />
              )}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-action-accent">
              Step {currentStep} of 3
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white">
              {currentStep === 1
                ? 'Start trading in minutes'
                : 'Verify your email address'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-tertiary">
              {currentStep === 1
                ? 'Your GridX account gives you access to the peer-to-peer energy marketplace.'
                : 'Email verification protects your account and confirms where GridX should send important trading updates.'}
            </p>

            {currentStep === 1 ? (
              <ul className="mt-7 space-y-4">
                {ACCOUNT_BENEFITS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-text-tertiary"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border-default bg-background-surface text-action-accent">
                      <Icon className="size-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-2xl border border-border-default bg-background-surface/60 p-5">
                <p className="text-sm font-semibold text-text-primary">
                  What happens next?
                </p>
                <ol className="mt-4 space-y-3 text-sm text-text-tertiary">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-action-accent" />
                    Enter the one-time code sent to your email.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-action-accent" />
                    Continue to KYC identity verification.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-action-accent" />
                    Connect your smart meter to complete onboarding.
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-auto border-t border-border-subtle pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-disabled">
                Privacy & security
              </p>
              <ul className="mt-4 space-y-3 text-xs text-text-disabled">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-action-accent" />
                  Your data is encrypted end-to-end
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-action-accent" />
                  Never sold to third parties
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-action-accent" />
                  ISO 27001-aligned security practices
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function GridXBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-2xl bg-action-accent text-white shadow-sm">
        <Zap className="size-[18px] fill-current" />
      </span>
      <span className="font-heading text-xl font-bold text-white">GridX</span>
    </div>
  )
}

function VerifyEmailStep({
  email,
  onBack,
}: {
  email: string
  onBack: () => void
}) {
  const [code, setCode] = React.useState('')

  return (
    <div>
      <div className="flex size-12 items-center justify-center rounded-2xl border border-action-accent/30 bg-action-accent/10 text-action-accent">
        <MailCheck className="size-6" />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-action-accent">
        Step 2 · Verify email
      </p>
      <h1 className="mt-2 font-heading text-[28px] font-bold leading-tight tracking-[-0.02em] text-text-primary">
        Check your inbox
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-tertiary">
        We sent a six-digit verification code to{' '}
        <strong className="font-semibold text-text-primary">{email}</strong>.
      </p>

      <div className="mt-8 space-y-2">
        <label
          htmlFor="verificationCode"
          className="block text-xs font-semibold uppercase tracking-[0.03em] text-text-secondary"
        >
          Verification code
        </label>
        <input
          id="verificationCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="000000"
          className="h-14 w-full rounded-2xl border border-border-input bg-background-well px-4 text-center font-mono text-xl tracking-[0.45em] text-text-primary outline-none transition focus:border-action-accent focus:ring-2 focus:ring-action-accent/20"
        />
      </div>

      <button
        type="button"
        disabled={code.length !== 6}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-action-accent text-base font-semibold text-white transition hover:bg-action-accent/90 disabled:cursor-not-allowed disabled:bg-action-accent/45 disabled:text-text-secondary"
      >
        Verify email
        <ArrowRight className="size-4" />
      </button>

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-text-tertiary hover:text-text-primary"
        >
          Back
        </button>
        <button
          type="button"
          className="font-semibold text-action-accent hover:underline"
        >
          Resend code
        </button>
      </div>
    </div>
  )
}
