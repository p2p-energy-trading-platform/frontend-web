import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Check,
  Leaf,
  LockKeyhole,
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
      await new Promise((resolve) => window.setTimeout(resolve, 700))
      setUserEmail(data.email)
      setCurrentStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#0c1424] text-[#e2eaf4]">
      <section className="h-[120px] overflow-hidden bg-[#152035] px-5 py-4 sm:px-10 lg:px-[72px]">
        <div className="mx-auto max-w-[1197px]">
          <RegistrationStepper
            steps={REGISTRATION_STEPS}
            currentStep={currentStep}
          />
        </div>
      </section>

      <div className="grid min-h-[calc(100vh-120px)] lg:grid-cols-2">
        <section className="flex justify-center bg-[#0c1424] px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[460px]">
            {currentStep === 1 ? (
              <>
                <h1 className="font-heading text-[26px] font-bold leading-[34px]">
                  Create your account
                </h1>
                <p className="mt-1 flex gap-1 text-sm leading-5 text-[#7a90a8]">
                  Already have an account?{' '}
                  <Link
                    to="/sign-in"
                    className="font-semibold text-[#0ea592] hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
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

        <aside className="relative hidden min-h-[808px] overflow-hidden bg-[#080f1e] px-8 py-10 lg:block">
          <div className="absolute -top-32 right-0 size-[400px] rounded-full bg-[#0ea592]/10 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-blue-500/[0.06] blur-[80px]" />
          <div className="relative mx-auto flex h-full max-w-[606px] flex-col">
            <GridXBrand />

            <div className="mt-10 flex size-12 items-center justify-center rounded-2xl border border-[#0ea592]/25 bg-[#0ea592]/15 text-[#0ea592]">
              {currentStep === 1 ? (
                <UserRoundPlus className="size-[22px]" />
              ) : (
                <MailCheck className="size-[22px]" />
              )}
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0ea592]">
              Step {currentStep} of 3
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold leading-[25px] text-white">
              {currentStep === 1
                ? 'Start trading in minutes'
                : 'Verify your email address'}
            </h2>
            <p className="mt-2 text-sm leading-[22px] text-[#c8d6e8]/55">
              {currentStep === 1
                ? 'Your GridX account gives you access to the full peer-to-peer energy marketplace.'
                : 'Email verification protects your account and confirms where GridX should send important trading updates.'}
            </p>

            {currentStep === 1 ? (
              <ul className="mt-6 space-y-3.5">
                {ACCOUNT_BENEFITS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-[#c8d6e8]/65"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-[#0ea592]">
                      <Icon className="size-3.5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-7 rounded-2xl border border-[#94b4dc19] bg-[#152035]/60 p-5">
                <p className="text-sm font-semibold">What happens next?</p>
                <ol className="mt-4 space-y-3 text-sm text-[#7a90a8]">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 text-[#0ea592]" />
                    Enter the one-time code sent to your email.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 text-[#0ea592]" />
                    Continue to KYC identity verification.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 text-[#0ea592]" />
                    Connect your smart meter to complete onboarding.
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-auto border-t border-[#94b4dc14] pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#c8d6e8]/35">
                Privacy & security
              </p>
              <ul className="mt-3 space-y-2 text-[11px] text-[#c8d6e8]/45">
                <li className="flex items-center gap-2">
                  <LockKeyhole className="size-3 text-[#0ea592]" />
                  Your data is encrypted end-to-end
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-3 text-[#0ea592]" />
                  Never sold to third parties
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3 text-[#0ea592]" />
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
      <span className="flex size-8 items-center justify-center rounded-xl bg-[#0ea592] text-white">
        <Zap className="size-[15px] fill-current" />
      </span>
      <span className="font-heading text-lg font-bold text-white">GridX</span>
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
      <div className="flex size-12 items-center justify-center rounded-2xl border border-[#0ea592]/30 bg-[#0ea592]/10 text-[#0ea592]">
        <MailCheck className="size-6" />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0ea592]">
        Step 2 · Verify email
      </p>
      <h1 className="mt-2 font-heading text-[28px] font-bold leading-tight">
        Check your inbox
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#7a90a8]">
        We sent a six-digit verification code to{' '}
        <strong className="font-semibold text-[#e2eaf4]">{email}</strong>.
      </p>
      <div className="mt-8 space-y-2">
        <label
          htmlFor="verificationCode"
          className="block text-xs font-semibold uppercase tracking-[0.03em] text-[#a8bdd4]"
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
          className="h-14 w-full rounded-2xl border border-[#94b4dc23] bg-[#1c2e48] px-4 text-center font-mono text-xl tracking-[0.45em] outline-none focus:border-[#0ea592] focus:ring-2 focus:ring-[#0ea592]/20"
        />
      </div>
      <button
        type="button"
        disabled={code.length !== 6}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0ea592] text-base font-semibold text-white disabled:bg-[#124b48] disabled:text-[#7a90a8]"
      >
        Verify email <ArrowRight className="size-4" />
      </button>
      <div className="mt-5 flex justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-[#7a90a8] hover:text-[#e2eaf4]"
        >
          Back
        </button>
        <button
          type="button"
          className="font-semibold text-[#0ea592] hover:underline"
        >
          Resend code
        </button>
      </div>
    </div>
  )
}

