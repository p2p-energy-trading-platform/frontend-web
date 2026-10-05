import { Link } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { PasswordInput } from '../ui/password-input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';

export default function ResetPasswordView() {
  return (
    <>
      <header>
        <h1 className="font-heading text-heading-1">Reset password</h1>

        <p className="mt-1.5 text-sm text-text-tertiary">
          Create a new password for your GridX account.
        </p>
      </header>

      <form className="mt-7">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              className="h-12 rounded-2xl"
              innerClass="px-4"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              className="h-12 rounded-2xl"
              innerClass="px-4"
              required
            />
          </Field>

          <Field>
            <Button type="submit" className="h-12 w-full rounded-xl">
              Reset password
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
