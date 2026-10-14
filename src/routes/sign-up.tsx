import { createFileRoute, redirect } from '@tanstack/react-router';

import SignupView from '#/components/auth/SignupView';
import { authUserQueryOptions } from '#/features/auth/hooks';

interface SignUpSearch {
  step?: 'kyc';
}

export const Route = createFileRoute('/sign-up')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): SignUpSearch =>
    search.step === 'kyc' ? { step: 'kyc' } : {},
  beforeLoad: async ({ context, search }) => {
    let user = null;
    try {
      user = await context.queryClient.ensureQueryData(authUserQueryOptions);
    } catch {
      // Public auth pages remain usable while the gateway is unavailable.
    }
    if (user && search.step !== 'kyc') {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: SignupView,
});
