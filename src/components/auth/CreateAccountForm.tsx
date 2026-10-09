import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Checkbox } from '#/components/ui/checkbox';
import { Input } from '#/components/ui/input';
import { ApiError, NetworkError } from '#/api/client';
import { useRegister } from '#/features/auth/useRegister';
import { PasswordInput } from '../ui/password-input';
import { Link } from '@tanstack/react-router';

interface CreateAccountFormProps {
  onSuccess: (email: string) => Promise<void> | void;
}

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const registerMutation = useRegister();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string[]>>
  >({});
  const [formError, setFormError] = useState<string>();
  const [requestId, setRequestId] = useState<string>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState<number>();
  const [remainingRateLimitSeconds, setRemainingRateLimitSeconds] =
    useState<number>();

  useEffect(() => {
    if (!rateLimitUntil) {
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(
        0,
        Math.ceil((rateLimitUntil - Date.now()) / 1000),
      );
      setRemainingRateLimitSeconds(remaining);
      if (remaining === 0) {
        setRateLimitUntil(undefined);
      }
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(interval);
  }, [rateLimitUntil]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    const nextFieldErrors: Partial<Record<string, string[]>> = {};

    if (!email) {
      nextFieldErrors.email = ['Email is required'];
    } else if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextFieldErrors.email = ['Enter a valid email address'];
    }
    if (password.length < 8 || password.length > 128) {
      nextFieldErrors.password = ['Password must be 8 to 128 characters'];
    }
    if (confirmPassword !== password) {
      nextFieldErrors.confirmPassword = ['Passwords do not match'];
    }
    if (!termsAccepted) {
      nextFieldErrors.termsAccepted = ['You must accept the terms to continue'];
    }

    setFieldErrors(nextFieldErrors);
    setFormError(undefined);
    setRequestId(undefined);
    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    try {
      await registerMutation.mutateAsync({ email, password });
      await onSuccess(email);
    } catch (error) {
      if (error instanceof NetworkError) {
        setFormError('Cannot reach the server');
        return;
      }

      if (!(error instanceof ApiError)) {
        setFormError('Something went wrong, please try again');
        return;
      }

      console.error('Registration failed', {
        status: error.status,
        code: error.code,
        requestId: error.requestId,
      });

      setRequestId(error.status >= 500 ? error.requestId : undefined);
      if (error.status === 400) {
        const errors: Partial<Record<string, string[]>> = {};
        for (const detail of error.details) {
          const field = detail.path.split('/').at(-1);
          if (field) {
            errors[field] = [...(errors[field] ?? []), detail.message];
          }
        }
        setFieldErrors(errors);
      } else if (error.status === 409) {
        setFieldErrors({ email: [error.message] });
      } else if (error.status === 429) {
        const seconds = error.retryAfterSeconds ?? 60;
        setRateLimitUntil(Date.now() + seconds * 1000);
        setRemainingRateLimitSeconds(seconds);
        setFormError(`Too many attempts, try again in ${seconds} seconds`);
      } else if (error.status === 503 || error.status === 504) {
        setFormError('Service temporarily unavailable, please try again');
      } else {
        setFormError('Something went wrong, please try again');
      }
    }
  }

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
      <form onSubmit={handleSubmit} noValidate className="my-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              className="h-12 rounded-2xl px-4"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldError
              errors={fieldErrors.email?.map((message) => ({ message }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              className="h-12 rounded-2xl"
              innerClass="px-4"
              autoComplete="new-password"
              placeholder="Create a strong password"
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <FieldError
              errors={fieldErrors.password?.map((message) => ({ message }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="h-12 rounded-2xl"
              innerClass="px-4"
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
            <FieldError
              errors={fieldErrors.confirmPassword?.map((message) => ({
                message,
              }))}
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="termsAccepted"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked)}
              aria-invalid={Boolean(fieldErrors.termsAccepted)}
            />
            <FieldLabel htmlFor="termsAccepted">
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
              errors={fieldErrors.termsAccepted?.map((message) => ({
                message,
              }))}
            />
          </Field>
          <Field>
            {formError ? (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            ) : null}
            {requestId ? (
              <p className="text-xs text-text-tertiary">
                Reference: {requestId}
              </p>
            ) : null}
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={
                registerMutation.isPending ||
                (remainingRateLimitSeconds !== undefined &&
                  remainingRateLimitSeconds > 0)
              }
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
