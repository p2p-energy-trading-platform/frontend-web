import * as React from 'react'

import { CreateAccountForm } from '#/components/auth/CreateAccountForm'
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

  async function handleCreateAccount() {
    setView('verify-email');
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
              <CreateAccountForm
                onSuccess={handleCreateAccount}
              />
            ) : null}

            {view === 'verify-email' ? (
              <VerifyEmailStep
                email="test@example.com"
                onBack={() => setView('account')}
                onVerified={handleEmailVerified}
              />
            ) : null}

            {view === 'kyc' ? (
              <KycStep onComplete={handleKycComplete} />
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

