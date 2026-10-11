import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import { useRequestPasswordReset } from '#/features/auth/hooks';
import { forgotPasswordSchema } from '#/features/auth/schemas';
import type { ForgotPasswordFormValues } from '#/features/auth/schemas';
import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { toast } from '#/components/ui/toast';
import {
  formatFieldError,
  getApiFieldErrors,
  getGeneralFormError,
  getRequestIdError,
} from '#/lib/form-errors';
import { FORGOT_PASSWORD_ERROR_FIELDS } from '#/features/auth/errors';

export default function ForgotPasswordView() {
  const resetMutation = useRequestPasswordReset();

  const form = useForm({
    defaultValues: { email: '' } satisfies ForgotPasswordFormValues,
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      await resetMutation.mutateAsync({ email: value.email });

      toast.add({
        title:
          'If an account exists for that email, a password-reset link will be sent.',
        type: 'success',
      });
    },
  });

  return (
    <>
      <header>
        <h1 className="font-heading text-heading-1">Forgot password?</h1>

        <p className="mt-1.5 text-sm text-text-tertiary">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
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
          <form.Field name="email">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    resetMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(resetMutation.error, 'email').length > 0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(resetMutation.error, 'email'),
                  ]}
                />
              </Field>
            )}
          </form.Field>

          {getGeneralFormError(
            resetMutation.error,
            FORGOT_PASSWORD_ERROR_FIELDS,
          ) ? (
            <FieldError>
              {getGeneralFormError(
                resetMutation.error,
                FORGOT_PASSWORD_ERROR_FIELDS,
              )}
            </FieldError>
          ) : null}
          {getRequestIdError(resetMutation.error) ? (
            <p className="text-xs text-text-disabled">
              {getRequestIdError(resetMutation.error)}
            </p>
          ) : null}

          <Field>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? 'Sending...' : 'Send reset link'}
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
