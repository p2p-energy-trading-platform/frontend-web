import { CreateAccountForm } from '#/components/auth/CreateAccountForm';
import { KycStep } from '#/components/auth/KycStep';
import { RegistrationStepper } from '#/components/auth/RegistrationStepper';
import { SmartMeterStep } from '#/components/auth/SmartMeterStep';
import { VerifyEmailStep } from '#/components/auth/VerifyEmailStep';
import { useRegistration } from '#/hooks/useAuth';
import type { KycStatus, SIGN_UP_STATES, SmartMeterStatus } from './types';
import { registrationSteps } from '#/data/auth';
import SignupSidebar from './SignupSidebar';
import RegistrationComplete from './RegistrationComplete';
import { useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useAuthUser } from '#/features/auth/hooks';
import type { AuthKycStatus } from '#/features/auth/api';
import { EmptyState } from '../ui/empty-state';
import { Loader } from 'lucide-react';

const PENDING_VERIFICATION_EMAIL_KEY = 'gridx.pendingVerificationEmail';
const routeApi = getRouteApi('/sign-up');

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

function getInitialKycStatus(status: AuthKycStatus | undefined): KycStatus {
  switch (status) {
    case 'PENDING':
      return 'pending';
    case 'VERIFIED':
      return 'verified';
    case 'REJECTED':
      return 'rejected';
    default:
      return 'not-submitted';
  }
}

export default function SignupView() {
  const registration = useRegistration();
  const { data: authUser, isLoading: isAuthLoading } = useAuthUser();
  const { step } = routeApi.useSearch();
  const navigate = useNavigate();
  const view: SIGN_UP_STATES = step ?? 'account';

  const [registeredEmail, setRegisteredEmail] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : (window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) ?? ''),
  );
  const [kycStatus, setKycStatus] = useState<KycStatus>('not-submitted');
  const [meterStatus, setMeterStatus] = useState<SmartMeterStatus>('skipped');

  const currentStep = getCurrentStep(view);
  const email = authUser?.email ?? registeredEmail;
  const displayedKycStatus =
    kycStatus !== 'not-submitted'
      ? kycStatus
      : authUser?.status === 'ACTIVE'
        ? getInitialKycStatus(authUser.kycStatus)
        : kycStatus;

  async function goToStep(nextStep: SIGN_UP_STATES) {
    await navigate({
      to: '/sign-up',
      search: { step: nextStep },
    });
  }

  async function handleCreateAccount(emailAddress: string) {
    const normalizedEmail = emailAddress.trim();
    window.sessionStorage.setItem(
      PENDING_VERIFICATION_EMAIL_KEY,
      normalizedEmail,
    );
    setRegisteredEmail(normalizedEmail);
    await goToStep('verify-email');
  }

  async function handleEmailVerified() {
    await registration.advanceStep();
    window.sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
    await goToStep('kyc');
  }

  function handleKycComplete(status: KycStatus) {
    setKycStatus(status);
    void goToStep('smart-meter');
  }

  async function handleSmartMeterComplete(status: SmartMeterStatus) {
    await registration.completeSmartMeter();
    setMeterStatus(status);
    await goToStep('complete');
  }

  if (isAuthLoading) {
    return (
      <EmptyState
        title="Loading"
        description="Loading Create Account"
        icon={Loader}
      />
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col bg-background text-foreground lg:h-screen lg:overflow-hidden"
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

      <div className="grid lg:min-h-0 lg:flex-1 lg:grid-cols-2">
        <section className="flex justify-center bg-background px-5 py-10 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain lg:px-16">
          <div className="w-full max-w-lg">
            {view === 'account' ? (
              <CreateAccountForm onSuccess={handleCreateAccount} />
            ) : null}

            {view === 'verify-email' ? (
              <VerifyEmailStep
                email={email}
                onBack={() => {
                  window.sessionStorage.removeItem(
                    PENDING_VERIFICATION_EMAIL_KEY,
                  );
                  setRegisteredEmail('');
                  void goToStep('account');
                }}
                onVerified={handleEmailVerified}
              />
            ) : null}

            {view === 'kyc' ? <KycStep onComplete={handleKycComplete} /> : null}

            {view === 'smart-meter' ? (
              <SmartMeterStep onComplete={handleSmartMeterComplete} />
            ) : null}

            {view === 'complete' ? (
              <RegistrationComplete
                kycStatus={displayedKycStatus}
                meterStatus={meterStatus}
              />
            ) : null}
          </div>
        </section>

        <aside className="relative hidden min-h-0 overflow-y-auto bg-sidebar px-10 py-10 lg:block lg:h-full">
          <SignupSidebar
            view={view}
            step={currentStep}
            kycStatus={displayedKycStatus}
            meterStatus={meterStatus}
          />
        </aside>
      </div>
    </main>
  );
}
