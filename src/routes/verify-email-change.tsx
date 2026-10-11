import { createFileRoute } from '@tanstack/react-router';

import VerifyEmailChangeView from '#/components/auth/VerifyEmailChangeView';

export const Route = createFileRoute('/verify-email-change')({
  ssr: false,
  component: VerifyEmailChangeView,
});
