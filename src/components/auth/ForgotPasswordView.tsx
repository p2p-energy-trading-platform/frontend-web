import { Link } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import AuthSplitLayout from './AuthSplitLayout';

export default function ForgotPasswordView() {
  return (
    <AuthSplitLayout>
      <header>
        <h1 className="font-heading text-heading-1">Forgot password?</h1>

        <p className="mt-1.5 text-sm text-text-tertiary">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </header>

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
            <Button type="submit" className="h-12 w-full rounded-xl">
              Send reset link
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
    </AuthSplitLayout>
  );
}
