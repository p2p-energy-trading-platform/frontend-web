import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from '@tanstack/react-router';

import { useLogin } from '#/features/auth/hooks';
import { loginSchema } from '#/features/auth/schemas';
import type { LoginFormValues } from '#/features/auth/schemas';
import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { PasswordInput } from '#/components/ui/password-input';
import {
  getApiFieldErrors,
  formatFieldError,
  getGeneralFormError,
  getRequestIdError,
} from '#/lib/form-errors';
import { LOGIN_ERROR_FIELDS } from '#/features/auth/errors';

export default function SignInForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const form = useForm({
    defaultValues: { email: '', password: '' } satisfies LoginFormValues,
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync({
        email: value.email,
        password: value.password,
      });
      await navigate({ to: '/dashboard' });
    },
  });

  return (
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
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={
                  field.state.meta.errors.length > 0 ||
                  getApiFieldErrors(loginMutation.error, 'email').length > 0
                }
              />
              <FieldError
                errors={[
                  ...field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  })),
                  ...getApiFieldErrors(loginMutation.error, 'email'),
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
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-12 rounded-2xl "
                innerClass="px-4"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={
                  field.state.meta.errors.length > 0 ||
                  getApiFieldErrors(loginMutation.error, 'password').length > 0
                }
              />
              <FieldError
                errors={[
                  ...field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  })),
                  ...getApiFieldErrors(loginMutation.error, 'password'),
                ]}
              />
            </Field>
          )}
        </form.Field>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {getGeneralFormError(loginMutation.error, LOGIN_ERROR_FIELDS) ? (
          <FieldError>
            {getGeneralFormError(loginMutation.error, LOGIN_ERROR_FIELDS)}
          </FieldError>
        ) : null}
        {getRequestIdError(loginMutation.error) ? (
          <p className="text-xs text-text-disabled">
            {getRequestIdError(loginMutation.error)}
          </p>
        ) : null}

        <Field>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </Field>
      </FieldGroup>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-text-disabled">
        <span className="h-px flex-1 bg-muted/50" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-muted/50" />
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold cursor-pointer hover:bg-card/80 "
        >
          <img
            src="/auth/google.svg"
            alt=""
            aria-hidden="true"
            className="size-4.5"
          />
          Google
        </Button>
      </div>

      <p className="mt-2.5 text-center text-caption text-text-disabled">
        These options may not yet be available in all regions.
      </p>
      <p className="mt-6 text-center text-sm text-text-tertiary">
        New to GridX?{' '}
        <Link
          to="/sign-up"
          className="font-semibold text-accent hover:underline"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}
