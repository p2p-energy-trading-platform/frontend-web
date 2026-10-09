import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import { ApiError } from '#/lib/api-client';
import { useRegister } from '#/features/auth/useRegister';
import { registerSchema } from '#/features/auth/schemas';
import type { RegisterFormValues } from '#/features/auth/schemas';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { PasswordInput } from '#/components/ui/password-input';
import { toast } from '#/components/ui/toast';

interface CreateAccountFormProps {
  onSuccess: (email: string) => Promise<void> | void;
}

function formatFieldError(error: unknown): { message: string } {
  return {
    message:
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : '',
  };
}

function apiFieldErrors(
  error: unknown,
  field: keyof RegisterFormValues,
): Array<{ message: string }> {
  if (!(error instanceof ApiError)) return [];
  if (error.status === 409 && field === 'email') {
    return [{ message: error.message }];
  }
  if (error.status !== 400) return [];
  return error.details
    .filter((detail) => detail.path === `/${field}`)
    .map((detail) => ({ message: detail.message }));
}

function formError(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  if (error.status === 400) {
    const message = error.details
      .filter(
        (detail) =>
          detail.path !== '/email' &&
          detail.path !== '/password' &&
          detail.path !== '/confirmPassword' &&
          detail.path !== '/termsAccepted',
      )
      .map((detail) => detail.message)
      .join(' ');

    return message || undefined;
  }
  return undefined;
}

function requestIdError(error: unknown): string | undefined {
  if (
    error instanceof ApiError &&
    (error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504) &&
    error.requestId
  ) {
    return `Request ID: ${error.requestId}`;
  }
  return undefined;
}

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const registerMutation = useRegister();
  const defaultValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync({
        email: value.email,
        password: value.password,
      });
      toast.add({
        title: 'Account created. We sent a verification code to your email.',
        type: 'success',
      });
      await onSuccess(value.email);
    },
  });

  return (
    <>
      <h1 className="font-heading text-heading-1 font-bold leading-8">
        Create your account
      </h1>
      <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-semibold text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        noValidate
        className="my-6"
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    apiFieldErrors(registerMutation.error, 'email').length > 0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map((error) => ({
                      ...formatFieldError(error),
                    })),
                    ...apiFieldErrors(registerMutation.error, 'email'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    apiFieldErrors(registerMutation.error, 'password').length >
                      0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map((error) => ({
                      ...formatFieldError(error),
                    })),
                    ...apiFieldErrors(registerMutation.error, 'password'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError
                  errors={field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  }))}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="termsAccepted">
            {(field) => (
              <Field orientation="horizontal">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    registerMutation.reset();
                    field.handleChange(checked === true);
                  }}
                />
                <FieldLabel htmlFor={field.name}>
                  I agree to the{' '}
                  <a
                    href="/terms"
                    className="font-semibold text-accent hover:underline"
                  >
                    GridX Terms
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    className="font-semibold text-accent hover:underline"
                  >
                    Privacy Policy
                  </a>
                </FieldLabel>
                <FieldError
                  errors={field.state.meta.errors.map((error) =>
                    formatFieldError(error),
                  )}
                />
              </Field>
            )}
          </form.Field>
          {formError(registerMutation.error) ? (
            <FieldError>{formError(registerMutation.error)}</FieldError>
          ) : null}
          {requestIdError(registerMutation.error) ? (
            <p className="text-xs text-text-disabled">
              {requestIdError(registerMutation.error)}
            </p>
          ) : null}
          <Field>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? 'Creating Account...'
                : 'Create Account'}
            </Button>
            <p className="mt-3.5 text-center text-caption leading-4 text-text-disabled">
              Complete all fields and accept the terms to continue.
            </p>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
