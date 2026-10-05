import ForgotPasswordView from '#/components/auth/ForgotPasswordView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordView,
});
