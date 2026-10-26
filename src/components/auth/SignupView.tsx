import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { CreateAccountForm } from '#/components/auth/CreateAccountForm';
import { KycStep } from '#/components/auth/KycStep';
import RegistrationComplete from '#/components/auth/RegistrationComplete';
import { SmartMeterStep } from '#/components/auth/SmartMeterStep';
import { StepHeader } from '#/components/auth/AuthStepHeader';
import { VerifyEmailStep } from '#/components/auth/VerifyEmailStep';
import { useRegistration } from '#/hooks/useAuth';
import type { KycStatus, SIGN_UP_STATES, SmartMeterStatus } from './types';

export default function SignupView() {
  const navigate = useNavigate();
  const registration = useRegistration();
  const [view, setView] = useState<SIGN_UP_STATES>('account');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [kycStatus, setKycStatus] = useState<KycStatus>('not-submitted');
  const [meterStatus, setMeterStatus] = useState<SmartMeterStatus>('skipped');

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
    if (status === 'skipped') {
      void navigate({ to: '/profile' });
      return;
    }
    setView('complete');
  }

  function handleBack() {
    switch (view) {
      case 'account':
        void navigate({ to: '/sign-in' });
        break;
      case 'verify-email':
        setView('account');
        break;
      case 'kyc':
        setView('verify-email');
        break;
      case 'smart-meter':
        setView('kyc');
        break;
    }
  }

  return (
    <main
      className="min-h-[100dvh] bg-bg-canvas text-text-primary"
      data-source={registration.source}
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[393px] flex-col">
        {view !== 'complete' ? (
          <div className="shrink-0 px-6">
            <StepHeader currentStep={currentStep} onBack={handleBack} />
          </div>
        ) : null}

        <section className="flex flex-1 justify-center overflow-y-auto scroll-pb-10 px-6 pt-6 pb-6">
          <div className="flex min-h-[calc(100dvh-104px)] w-full flex-col">
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
      </div>
    </main>
  );
}

function getCurrentStep(stepView: SIGN_UP_STATES): 1 | 2 | 3 | 4 {
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
