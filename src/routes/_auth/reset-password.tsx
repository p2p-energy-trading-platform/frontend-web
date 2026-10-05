import ResetPasswordView from '#/components/auth/ResetPasswordView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordView,
});
