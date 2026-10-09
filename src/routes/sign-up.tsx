import { createFileRoute, redirect } from '@tanstack/react-router';

import SignupView from '#/components/auth/SignupView';
import { authUserQueryOptions } from '#/features/auth/hooks';

export const Route = createFileRoute('/sign-up')({
  ssr: false,
  beforeLoad: async ({ context }) => {
    let user = null;
    try {
      user = await context.queryClient.ensureQueryData(authUserQueryOptions);
    } catch {
      // Public auth pages remain usable while the gateway is unavailable.
    }
    if (user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: SignupView,
});
