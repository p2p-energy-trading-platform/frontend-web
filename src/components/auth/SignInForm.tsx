import { Link } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import { Input } from '#/components/ui/input';
import { PasswordInput } from '../ui/password-input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';

export default function SignInForm() {
  return (
    <form className="mt-7">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-2xl px-4"

            required
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
            required
          />
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="rememberMe" />
          <FieldLabel htmlFor="rememberMe">Remember me for 30 days</FieldLabel>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs font-semibold text-accent"
          >
            Forgot password?
          </Button>
        </Field>
        <Field>
          <Button type="submit" className="h-12 w-full rounded-xl">
            Sign in
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
