import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { CreateAccountForm } from '#/components/auth/CreateAccountForm'
import type { CreateAccountFormData } from '#/components/auth/CreateAccountForm'
import { KycStep } from '#/components/auth/KycStep'
import { RegistrationStepper } from '#/components/auth/RegistrationStepper'
import { SmartMeterStep } from '#/components/auth/SmartMeterStep'
import { VerifyEmailStep } from '#/components/auth/VerifyEmailStep'
import { useRegistration } from '#/hooks/useAuth'
import type { KycStatus, SIGN_UP_STATES, SmartMeterStatus } from './types'
import { registrationSteps } from '#/data/auth'
import SignupSidebar from './SignupSidebar'
import RegistrationComplete from './RegistrationComplete'

export default function Signup() {
  const registration = useRegistration()
  const [view, setView] = React.useState<SIGN_UP_STATES>('account')
  const [isLoading, setIsLoading] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState('')
  const [kycStatus, setKycStatus] = React.useState<KycStatus>('not-submitted')
  const [meterStatus, setMeterStatus] =
    React.useState<SmartMeterStatus>('skipped')

  function getCurrentStep(stepView: SIGN_UP_STATES) {
    switch (stepView) {
      case 'account':
        return 1;
      case 'verify-email':
        return 2;
      case 'kyc':
        return 3;
      case 'smart-meter':
        return 4;
      case 'complete':
        return 5;
    }
  }

  const currentStep = getCurrentStep(view);

  async function handleCreateAccount(data: CreateAccountFormData) {
    setIsLoading(true)

    try {
      await registration.submitAccount()
      setUserEmail(data.email)
      setView('verify-email')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEmailVerified() {
    await registration.advanceStep()
    setView('kyc')
  }

  async function handleKycComplete(status: KycStatus) {
    await registration.completeKyc()
    setKycStatus(status)
    setView('smart-meter')
  }

  async function handleSmartMeterComplete(status: SmartMeterStatus) {
    await registration.completeSmartMeter()
    setMeterStatus(status)
    setView('complete')
  }

  return (
    <main
      className="flex h-screen flex-col overflow-hidden bg-background text-foreground"
      data-source={registration.source}
    >
      <section className="shrink-0 overflow-hidden bg-card px-5 py-4 sm:px-10">
        <div className="mx-auto">
          <RegistrationStepper
            steps={registrationSteps}
            currentStep={currentStep}
          />
        </div>
      </section>

      <div className="grid flex-1 min-h-0 lg:grid-cols-2">
        <section className="flex justify-center overflow-y-auto bg-background px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg">
            {view === 'account' ? (
              <>
                <h1 className="font-heading text-heading-1 font-bold leading-8.5">
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

        <aside className="relative max-lg:hidden overflow-y-auto bg-sidebar px-8 py-10">
          <SignupSidebar
            view={view}
            step={currentStep}
            kycStatus={kycStatus}
            meterStatus={meterStatus}
          />
        </aside>
      </div>
    </main>
  )
}

