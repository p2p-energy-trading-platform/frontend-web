import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { AuthStepHeader } from '#/components/auth/AuthStepHeader';
import { CreateAccountForm } from '#/components/auth/CreateAccountForm';
import RegistrationComplete from '#/components/auth/RegistrationComplete';
import { KycStep } from '#/components/auth/KycStep';
import { RegistrationStepper } from '#/components/auth/RegistrationStepper';
import SignupSidebar from '#/components/auth/SignupSidebar';
import { SmartMeterStep } from '#/components/auth/SmartMeterStep';
import { VerifyEmailStep } from '#/components/auth/VerifyEmailStep';
import { registrationSteps } from '#/data/auth';
import { useRegistration } from '#/hooks/useAuth';
import type { KycStatus, SIGN_UP_STATES, SmartMeterStatus } from './types';

export default function SignupView() {
  const navigate = useNavigate();
  const registration = useRegistration();
  const [view, setView] = useState<SIGN_UP_STATES>('account');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [kycStatus, setKycStatus] = useState<KycStatus>('not-submitted');
  const [meterStatus, setMeterStatus] = useState<SmartMeterStatus>('skipped');

  const isInitialStep = view === 'account' || view === 'verify-email';
  const currentStep = getCurrentStep(view);

  function handleCreateAccount(email: string) {
    setRegisteredEmail(email.trim());
    setView('verify-email');
  }

  async function handleEmailVerified() {
    await registration.advanceStep();
    setView('kyc');
  }

  function handleKycComplete(status: KycStatus) {
    setKycStatus(status);
    setView('smart-meter');
  }

  async function handleSmartMeterComplete(status: SmartMeterStatus) {
    await registration.completeSmartMeter();
    setMeterStatus(status);
    setView('complete');
  }

  return (
    <main
      className="flex min-h-[100dvh] flex-col bg-bg-canvas text-text-primary"
      data-source={registration.source}
    >
      {isInitialStep ? (
        <div className="grid lg:grid-cols-2">
          <div className="flex justify-center px-6 lg:px-12">
            <div className="w-full max-w-[393px]">
              <AuthStepHeader
                currentStep={view === 'account' ? 1 : 2}
                onBack={() => {
                  if (view === 'verify-email') {
                    setView('account');
                  } else {
                    void navigate({ to: '/sign-in' });
                  }
                }}
              />
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      ) : (
        <section className="shrink-0 overflow-hidden bg-card px-5 py-4 sm:px-10">
          <div className="mx-auto">
            <RegistrationStepper
              steps={registrationSteps}
              currentStep={currentStep}
            />
          </div>
        </section>
      )}

      <div className="grid flex-1 lg:grid-cols-2">
        <section
          className={
            isInitialStep
              ? `flex justify-center overflow-y-auto scroll-pb-10 bg-bg-canvas px-6 pb-8 ${view === 'verify-email' ? 'pt-8' : 'pt-6'} lg:px-12`
              : 'flex justify-center overflow-y-auto bg-background px-5 py-10 sm:px-10 lg:px-16'
          }
        >
          <div
            className={
              isInitialStep
                ? 'flex w-full max-w-[393px] flex-col'
                : 'w-full max-w-lg'
            }
          >
            {view === 'account' ? (
              <CreateAccountForm
                initialEmail={registeredEmail}
                onSuccess={handleCreateAccount}
              />
            ) : null}

            {view === 'verify-email' ? (
              <VerifyEmailStep
                email={registeredEmail}
                onBack={() => setView('account')}
                onVerified={handleEmailVerified}
              />
            ) : null}

            {view === 'kyc' ? <KycStep onComplete={handleKycComplete} /> : null}

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

        <aside className="relative hidden overflow-y-auto bg-sidebar px-8 py-10 lg:block">
          <SignupSidebar
            view={view}
            step={currentStep}
            kycStatus={kycStatus}
            meterStatus={meterStatus}
          />
        </aside>
      </div>
    </main>
  );
}

function getCurrentStep(stepView: SIGN_UP_STATES) {
  switch (stepView) {
    case 'account':
      return 1;
    case 'verify-email':
      return 2;
    case 'kyc':
      return 3;
    case 'smart-meter':
    case 'complete':
      return 4;
  }
}
