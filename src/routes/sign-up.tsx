import { createFileRoute, redirect } from '@tanstack/react-router';

import SignupView from '#/components/auth/SignupView';
import { authUserQueryOptions } from '#/features/auth/hooks';

export type SignUpStep =
  'account' | 'verify-email' | 'kyc' | 'smart-meter' | 'complete';

interface SignUpSearch {
  step?: SignUpStep;
}

const validSteps = new Set<SignUpStep>([
  'account',
  'verify-email',
  'kyc',
  'smart-meter',
  'complete',
]);

export const Route = createFileRoute('/sign-up')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): SignUpSearch =>
    typeof search.step === 'string' && validSteps.has(search.step as SignUpStep)
      ? { step: search.step as SignUpStep }
      : {},
  beforeLoad: async ({ context, search }) => {
    let user = null;

    try {
      user = await context.queryClient.ensureQueryData(authUserQueryOptions);
    } catch {
      // Public auth pages remain usable while the gateway is unavailable.
    }

    const step = search.step ?? 'account';
    const hasPendingVerificationEmail =
      typeof window !== 'undefined' &&
      Boolean(window.sessionStorage.getItem('gridx.pendingVerificationEmail'));

    if (!user) {
      if (
        step === 'account' ||
        (step === 'verify-email' && hasPendingVerificationEmail)
      ) {
        return;
      }

      throw redirect({ to: '/sign-up' });
    }

    if (user.status === 'PENDING') {
      if (step !== 'verify-email') {
        throw redirect({
          to: '/sign-up',
          search: { step: 'verify-email' },
        });
      }

      return;
    }

    if (user.status === 'ACTIVE') {
      const canAccessKyc =
        user.kycStatus === undefined || user.kycStatus === 'REJECTED';

      if (
        (step === 'kyc' && !canAccessKyc) ||
        (step !== 'kyc' && step !== 'smart-meter' && step !== 'complete')
      ) {
        throw redirect({ to: '/dashboard' });
      }

      return;
    }

    throw redirect({ to: '/dashboard' });
  },
  component: SignupView,
});
