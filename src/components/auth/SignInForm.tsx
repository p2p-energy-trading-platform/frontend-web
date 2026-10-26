import { useState } from 'react';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { Link, getRouteApi } from '@tanstack/react-router';

import { AuthDivider } from '#/components/auth/AuthDivider';
import { GoogleButton } from '#/components/auth/GoogleButton';
import { PasswordField, TextField } from '#/components/auth/AuthFields';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import { FieldGroup } from '#/components/ui/field';
import { toast } from '#/components/ui/toast';
import type { LoginFormValues } from '#/features/auth/schemas';
import { loginSchema } from '#/features/auth/schemas';
import { formatFieldError } from '#/lib/form-errors';

const signInRoute = getRouteApi('/_auth/sign-in');

function firstError(errors: unknown[]) {
  return errors.length > 0
    ? formatFieldError(errors[0]).message || undefined
    : undefined;
}

export default function SignInForm() {
  const { error: redirectError } = signInRoute.useSearch();
  const [rememberMe, setRememberMe] = useState(false);
  const form = useForm({
    defaultValues: { email: '', password: '' } satisfies LoginFormValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: loginSchema },
    onSubmit: () => {
      toast.add({
        title: 'Authentication is not connected in this preview.',
        type: 'info',
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <form
        noValidate
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-5">
          <form.Field name="email">
            {(field) => (
              <TextField
                id={field.name}
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={firstError(field.state.meta.errors)}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <PasswordField
                id={field.name}
                label="Password"
                autoComplete="current-password"
                placeholder="Enter your password"
                trailing={
                  <Link
                    to="/forgot-password"
                    className="text-[13px] leading-[18px] font-semibold text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={firstError(field.state.meta.errors)}
              />
            )}
          </form.Field>
        </FieldGroup>

        <label
          htmlFor="remember-me"
          className="mt-7 flex cursor-pointer items-center gap-3 text-sm leading-5 text-text-secondary"
        >
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            className="size-5 rounded-md border-border-input bg-bg-surface"
          />
          Remember me for 30 days
        </label>

        <Button
          type="submit"
          className="mt-8 h-[52px] w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Sign in
        </Button>

        {redirectError === 'google' ? (
          <p role="alert" className="mt-3 text-sm text-feedback-error-text">
            Google sign-in failed. Please try again.
          </p>
        ) : null}
      </form>

      <div className="my-6">
        <AuthDivider />
      </div>

      <GoogleButton
        onClick={() =>
          toast.add({
            title: 'Google sign-in is not connected in this preview.',
            type: 'info',
          })
        }
      />

      <p className="mt-auto pt-8 pb-8 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/sign-up"
          className="font-semibold text-accent hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
