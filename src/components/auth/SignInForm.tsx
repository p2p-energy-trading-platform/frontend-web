import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { ApiError, NetworkError } from '#/api/client';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import { FieldError } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { storeSession } from '#/features/auth/tokenStorage';
import { useLogin } from '#/features/auth/useLogin';
import { PasswordInput } from '../ui/password-input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';

export default function SignInForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string[]>>
  >({});
  const [formError, setFormError] = useState<string>();
  const [errorRequestId, setErrorRequestId] = useState<string>();
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number>();

  useEffect(() => {
    if (retryAfterSeconds === undefined) {
      return;
    }

    if (retryAfterSeconds <= 0) {
      setRetryAfterSeconds(undefined);
      return;
    }

    const timer = window.setTimeout(
      () => setRetryAfterSeconds((seconds) => (seconds ?? 1) - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [retryAfterSeconds]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const nextFieldErrors: Partial<Record<string, string[]>> = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextFieldErrors.email = ['Enter a valid email address'];
    }
    if (!password) {
      nextFieldErrors.password = ['Password is required'];
    }

    setFieldErrors(nextFieldErrors);
    setFormError(undefined);
    setErrorRequestId(undefined);
    if (
      Object.keys(nextFieldErrors).length > 0 ||
      retryAfterSeconds !== undefined
    ) {
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        email: trimmedEmail,
        password,
      });
      storeSession(response);
      await navigate({ to: '/dashboard' });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Login request failed', {
          status: error.status,
          code: error.code,
          requestId: error.requestId,
        });
        if (error.status === 400 && error.code === 'VALIDATION_ERROR') {
          const errors: Record<string, string[]> = {};
          for (const detail of error.details) {
            errors[detail.path] = [
              ...(errors[detail.path] ?? []),
              detail.message,
            ];
          }
          setFieldErrors(errors);
        } else if (error.status === 401 && error.code === 'UNAUTHENTICATED') {
          setFormError(
            error.message === 'Account is not active'
              ? `${error.message}. Please verify your email.`
              : error.message,
          );
        } else if (error.status === 429 && error.code === 'RATE_LIMITED') {
          setRetryAfterSeconds(error.retryAfterSeconds ?? 60);
          setFormError(
            `Too many attempts, try again in ${error.retryAfterSeconds ?? 60} seconds`,
          );
        } else if (error.status === 503 || error.status === 504) {
          setFormError('Service temporarily unavailable, please try again');
          setErrorRequestId(error.requestId);
        } else {
          setFormError('Unexpected error');
          if (error.status >= 500) {
            setErrorRequestId(error.requestId);
          }
        }
      } else if (error instanceof NetworkError) {
        setFormError(error.message);
      } else {
        setFormError('Unexpected error');
      }
    }
  }

  return (
    <form className="mt-7" onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-2xl px-4"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
          />
          <FieldError
            errors={fieldErrors.email?.map((message) => ({ message }))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 rounded-2xl"
            innerClass="px-4"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={fieldErrors.password ? true : undefined}
          />
          <FieldError
            errors={fieldErrors.password?.map((message) => ({ message }))}
          />
        </Field>

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
        {formError && <FieldError>{formError}</FieldError>}
        {errorRequestId && (
          <p className="text-xs text-text-tertiary">
            Request ID: {errorRequestId}
          </p>
        )}
        <Field>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl"
            disabled={
              loginMutation.isPending || retryAfterSeconds !== undefined
            }
          >
            {loginMutation.isPending
              ? 'Signing in...'
              : retryAfterSeconds !== undefined
                ? `Try again in ${retryAfterSeconds}s`
                : 'Sign in'}
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
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold"
        >
          <img
            src="/auth/google.svg"
            alt=""
            aria-hidden="true"
            className="size-4.5 shrink-0"
          />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 gap-2.5 rounded-2xl bg-card text-sm font-semibold"
        >
          <img
            src="/auth/microsoft.svg"
            alt=""
            aria-hidden="true"
            className="size-4.25 shrink-0"
          />
          Microsoft
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
