import { createFileRoute, redirect } from '@tanstack/react-router';

import SignupView from '#/components/auth/SignupView';
import { authUserQueryOptions } from '#/features/auth/hooks';

export const Route = createFileRoute('/sign-up')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      authUserQueryOptions,
    );
    if (user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: SignupView,
});
