import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from '@tanstack/react-router';

import { ApiError } from '#/lib/api-client';
import { useLogin } from '#/features/auth/hooks';
import { loginSchema } from '#/features/auth/schemas';
import type { LoginFormValues } from '#/features/auth/schemas';
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

function apiFieldErrors(
  error: unknown,
  field: keyof LoginFormValues,
): Array<{ message: string }> {
  if (!(error instanceof ApiError) || error.status !== 400) return [];
  return error.details
    .filter((detail) => detail.path === `/${field}`)
    .map((detail) => ({ message: detail.message }));
}

function formError(error: unknown): string | undefined {
  return error instanceof ApiError && error.status === 401
    ? error.message
    : undefined;
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
                  apiFieldErrors(loginMutation.error, 'email').length > 0
                }
              />
              <FieldError
                errors={[
                  ...field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  })),
                  ...apiFieldErrors(loginMutation.error, 'email'),
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
                className="h-12 rounded-2xl"
                innerClass="px-4"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={
                  field.state.meta.errors.length > 0 ||
                  apiFieldErrors(loginMutation.error, 'password').length > 0
                }
              />
              <FieldError
                errors={[
                  ...field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  })),
                  ...apiFieldErrors(loginMutation.error, 'password'),
                ]}
              />
            </Field>
          )}
        </form.Field>

        <Field orientation="horizontal">
          <Checkbox id="rememberMe" />
          <FieldLabel htmlFor="rememberMe">Remember me for 30 days</FieldLabel>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </Field>

        {formError(loginMutation.error) ? (
          <FieldError>{formError(loginMutation.error)}</FieldError>
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

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full justify-start gap-3 rounded-2xl bg-card px-4.25 text-sm font-semibold"
      >
        <img
          src="/auth/uae-pass.svg"
          alt=""
          aria-hidden="true"
          className="h-4.5 w-7 shrink-0"
        />
        <span className="flex-1 text-left">UAE PASS</span>
        <span className="shrink-0 rounded-full bg-background-well px-1.5 py-0.5 font-mono text-caption font-medium leading-3.75 text-text-tertiary dark:bg-white/10 dark:text-text-secondary">
          UAE Digital ID
        </span>
        <img
          src="/auth/chevron-right.svg"
          alt=""
          aria-hidden="true"
          className="size-3.5 shrink-0"
        />
      </Button>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {[
          ['/auth/google.svg', 'Google', 'size-4.5'],
          ['/auth/microsoft.svg', 'Microsoft', 'size-4.25'],
        ].map(([src, label, imageClass]) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold"
          >
            <img src={src} alt="" aria-hidden="true" className={imageClass} />
            {label}
          </Button>
        ))}
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
