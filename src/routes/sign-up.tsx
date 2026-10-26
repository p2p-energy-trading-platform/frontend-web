import { createFileRoute } from '@tanstack/react-router';

import SignupView from '#/components/auth/SignupView';

interface SignUpSearch {
  step?: 'kyc';
}

export const Route = createFileRoute('/sign-up')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): SignUpSearch =>
    search.step === 'kyc' ? { step: 'kyc' } : {},
  component: SignupView,
});
