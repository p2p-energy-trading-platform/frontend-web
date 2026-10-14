import SignInView from '#/components/auth/SignInView';
import { createFileRoute } from '@tanstack/react-router';

interface SignInSearch {
  error?: 'google';
}

export const Route = createFileRoute('/_auth/sign-in')({
  validateSearch: (search: Record<string, unknown>): SignInSearch =>
    search.error === 'google' ? { error: 'google' } : {},
  component: SignInView,
});
