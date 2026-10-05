import ResetPasswordView from '#/components/auth/ResetPasswordView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordView,
});
