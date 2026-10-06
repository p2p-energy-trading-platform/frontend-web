import SignInView from '#/components/auth/SignInView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInView,
});
