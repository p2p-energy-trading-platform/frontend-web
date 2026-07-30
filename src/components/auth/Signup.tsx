import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  Check,
  FileCheck2,
  Gauge,
  IdCard,
  Leaf,
  LockKeyhole,
  MailCheck,
  RadioTower,
  ShieldCheck,
  UserRoundPlus,
  WalletCards,
  Zap,
} from 'lucide-react'

import { CreateAccountForm } from '#/components/auth/CreateAccountForm'
import type { CreateAccountFormData } from '#/components/auth/CreateAccountForm'
import { KycStep } from '#/components/auth/KycStep'
import type { KycStatus } from '#/components/auth/KycStep'
import { RegistrationStepper } from '#/components/auth/RegistrationStepper'
import { SmartMeterStep } from '#/components/auth/SmartMeterStep'
import type { SmartMeterStatus } from '#/components/auth/SmartMeterStep'
import { VerifyEmailStep } from '#/components/auth/VerifyEmailStep'
import { saveKycStatus } from '#/lib/kyc-status'
import { saveSmartMeterStatus } from '#/lib/smart-meter-status'

const REGISTRATION_STEPS = [
  { id: 1, label: 'Account', description: 'Email & password' },
  { id: 2, label: 'Verify email', description: 'One-time code' },
  { id: 3, label: 'Identity', description: 'KYC verification' },
  { id: 4, label: 'Smart Meter', description: 'Optional connection' },
]

const ACCOUNT_BENEFITS = [
  { icon: Zap, text: 'Trade energy across 16 Dubai grid zones' },
  { icon: WalletCards, text: 'AED wallet with instant settlement' },
  { icon: ShieldCheck, text: 'Verified prosumer network you can trust' },
  { icon: Leaf, text: 'Measurable sustainability impact' },
  { icon: BarChart3, text: 'Real-time pricing and trade analytics' },
]

export default function Signup() {
  const [view, setView] = React.useState<
    'account' | 'verify-email' | 'kyc' | 'smart-meter' | 'complete'
  >('account')
  const [isLoading, setIsLoading] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState('')
  const [kycStatus, setKycStatus] = React.useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] =
    React.useState<SmartMeterStatus>('skipped')

  const currentStep =
    view === 'account'
      ? 1
      : view === 'verify-email'
        ? 2
        : view === 'kyc'
          ? 3
          : view === 'smart-meter'
            ? 4
            : 5

  async function handleCreateAccount(data: CreateAccountFormData) {
    setIsLoading(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700))
      setUserEmail(data.email)
      setView('verify-email')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEmailVerified() {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    setView('kyc')
  }

  async function handleKycComplete(status: KycStatus) {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    saveKycStatus(status)
    setKycStatus(status)
    setView('smart-meter')
  }

  async function handleSmartMeterComplete(status: SmartMeterStatus) {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    saveSmartMeterStatus(status)
    setMeterStatus(status)
    setView('complete')
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <section className="h-[120px] overflow-hidden bg-card px-5 py-4 sm:px-10 lg:px-[72px]">
        <div className="mx-auto max-w-[1197px]">
          <RegistrationStepper
            steps={REGISTRATION_STEPS}
            currentStep={currentStep}
          />
        </div>
      </section>

      <div className="grid min-h-[calc(100vh-120px)] lg:grid-cols-2">
        <section className="flex justify-center bg-background px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[460px]">
            {view === 'account' ? (
              <>
                <h1 className="font-heading text-[26px] font-bold leading-[34px]">
                  Create your account
                </h1>

                <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
                  Already have an account?{' '}
                  <Link
                    to="/sign-in"
                    className="font-semibold text-accent hover:underline"
                  >
                    Sign in
                  </Link>
                </p>

                <CreateAccountForm
                  onSuccess={handleCreateAccount}
                  isLoading={isLoading}
                />
              </>
            ) : null}

            {view === 'verify-email' ? (
              <VerifyEmailStep
                email={userEmail}
                onBack={() => setView('account')}
                onVerified={handleEmailVerified}
              />
            ) : null}

            {view === 'kyc' ? (
              <KycStep email={userEmail} onComplete={handleKycComplete} />
            ) : null}

            {view === 'smart-meter' ? (
              <SmartMeterStep onComplete={handleSmartMeterComplete} />
            ) : null}

            {view === 'complete' ? (
              <RegistrationComplete
                kycStatus={kycStatus}
                meterStatus={meterStatus}
              />
            ) : null}
          </div>
        </section>

        <aside className="relative hidden min-h-[808px] overflow-hidden bg-sidebar px-8 py-10 lg:block">
          <div className="absolute -top-32 right-0 size-[400px] rounded-full bg-accent/10 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-chart-4/[0.06] blur-[80px]" />

          <div className="relative mx-auto flex h-full max-w-[606px] flex-col">
            <GridXBrand />

            <div className="mt-10 flex size-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
              {view === 'account' ? (
                <UserRoundPlus className="size-[22px]" />
              ) : view === 'verify-email' ? (
                <MailCheck className="size-[22px]" />
              ) : view === 'kyc' ? (
                <IdCard className="size-[22px]" />
              ) : view === 'smart-meter' ? (
                <RadioTower className="size-[22px]" />
              ) : (
                <FileCheck2 className="size-[22px]" />
              )}
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
              Step {Math.min(currentStep, 4)} of 4
            </p>

            <h2 className="mt-1 font-heading text-xl font-bold leading-[25px] text-white">
              {view === 'account'
                ? 'Start trading in minutes'
                : view === 'verify-email'
                  ? 'Verify your email address'
                  : view === 'kyc'
                    ? 'Why we need to verify you'
                    : view === 'smart-meter'
                      ? 'Bring your energy data online'
                      : 'Your account is ready'}
            </h2>

            <p className="mt-2 text-sm leading-[22px] text-[#8492a6]">
              {view === 'account'
                ? 'Your GridX account gives you access to the full peer-to-peer energy marketplace.'
                : view === 'verify-email'
                  ? 'Email verification protects your account and confirms where GridX should send important trading updates.'
                  : view === 'kyc'
                    ? 'Identity verification is optional now, and helps GridX keep higher-value trades and payouts secure.'
                    : view === 'smart-meter'
                      ? 'A secure meter connection gives you live usage, generation data, and access to peer-to-peer trading.'
                      : 'All onboarding choices are saved. You can review verification and device status from your Profile.'}
            </p>

            {view === 'account' ? (
              <ul className="mt-6 space-y-3.5">
                {ACCOUNT_BENEFITS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-[#93a0b2]"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                      <Icon className="size-3.5" />
                    </span>

                    {text}
                  </li>
                ))}
              </ul>
            ) : view === 'verify-email' ? (
              <div className="mt-7 rounded-2xl border border-white/10 bg-[#15253e] p-5 shadow-sm">
                <p className="text-sm font-semibold text-white">
                  What happens next?
                </p>

                <ol className="mt-4 space-y-3 text-sm text-[#b1bccb]">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    Enter the one-time code sent to your email.
                  </li>

                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    Continue to KYC identity verification.
                  </li>

                  <li className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    Connect your smart meter to complete onboarding.
                  </li>
                </ol>
              </div>
            ) : view === 'kyc' ? (
              <ul className="mt-7 space-y-3.5">
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <Gauge className="size-3.5" />
                  </span>
                  Unlock higher peer-to-peer trading limits
                </li>
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <WalletCards className="size-3.5" />
                  </span>
                  Enable secure wallet payouts
                </li>
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  Documents are encrypted and reviewed securely
                </li>
              </ul>
            ) : view === 'smart-meter' ? (
              <ul className="mt-7 space-y-3.5">
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <RadioTower className="size-3.5" />
                  </span>
                  Receive live consumption and generation readings
                </li>
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <BarChart3 className="size-3.5" />
                  </span>
                  Use real-time data for smarter trading decisions
                </li>
                <li className="flex items-center gap-3 text-sm text-[#93a0b2]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
                    <ShieldCheck className="size-3.5" />
                  </span>
                  Compatible with SMETS2 &amp; most SMETS1 meters
                </li>
              </ul>
            ) : (
              <div className="mt-7 rounded-2xl border border-accent/20 bg-accent/[0.06] p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Email verified
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#8492a6]">
                      KYC status:{' '}
                      {kycStatus === 'pending'
                        ? 'Pending review'
                        : 'Not submitted'}
                      <br />
                      Smart meter:{' '}
                      {meterStatus === 'pending'
                        ? 'Pending approval'
                        : 'Skipped'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto border-t border-sidebar-border pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6c7f]">
                Privacy & security
              </p>

              <ul className="mt-3 space-y-2 text-[11px] text-[#68768a]">
                <li className="flex items-center gap-2">
                  <LockKeyhole className="size-3 text-accent" />
                  Your data is encrypted end-to-end
                </li>

                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-3 text-accent" />
                  Never sold to third parties
                </li>

                <li className="flex items-center gap-2">
                  <Check className="size-3 text-accent" />
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
      <span className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Zap className="size-[15px] fill-current" />
      </span>

      <span className="font-heading text-lg font-bold text-white">GridX</span>
    </div>
  )
}

function RegistrationComplete({
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

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
        Onboarding complete
      </p>

      <h1 className="mt-2 font-heading text-[28px] font-bold leading-tight">
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
        className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-foreground transition hover:bg-accent/90"
      >
        View Profile
      </Link>
    </div>
  )
}
