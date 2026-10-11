import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from '@tanstack/react-router';

import { useResetPassword } from '#/features/auth/hooks';
import { resetPasswordSchema } from '#/features/auth/schemas';
import type { ResetPasswordFormValues } from '#/features/auth/schemas';
import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { PasswordInput } from '#/components/ui/password-input';
import { toast } from '#/components/ui/toast';
import { formatFieldError, getErrorMessage } from '#/utils/errors';

export default function ResetPasswordView() {
  const resetMutation = useResetPassword();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    } satisfies ResetPasswordFormValues,
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      const token = new URLSearchParams(window.location.search).get('token');

      if (!token) {
        toast.add({
          title: 'This password-reset link is invalid or missing its token.',
          type: 'error',
        });
        return;
      }

      try {
        await resetMutation.mutateAsync({
          token,
          newPassword: value.password,
        });

        toast.add({
          title: 'Your password has been reset. You can now sign in.',
          type: 'success',
        });

        await navigate({ to: '/sign-in' });
      } catch (error) {
        toast.add({
          title: getErrorMessage(
            error,
            'Unable to reset your password. Please try again.',
          ),
          type: 'error',
        });
      }
    },
  });

  return (
    <>
      <header>
        <h1 className="font-heading text-heading-1">Reset password</h1>

        <p className="mt-1.5 text-sm text-text-tertiary">
          Create a new password for your GridX account.
        </p>
      </header>

      <form
        className="mt-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="password">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    resetMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError
                  errors={field.state.meta.errors.map(formatFieldError)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>
                  Confirm new password
                </FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    resetMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError
                  errors={field.state.meta.errors.map(formatFieldError)}
                />
              </Field>
            )}
          </form.Field>

          <Field>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? 'Resetting...' : 'Reset password'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-text-tertiary">
        Remember your password?{' '}
        <Link
          to="/sign-in"
          className="font-semibold text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
