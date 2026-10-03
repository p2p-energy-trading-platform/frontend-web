import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { PasswordInput } from '../ui/password-input'
import { Link } from '@tanstack/react-router'

interface CreateAccountFormProps {
  onSuccess: () => Promise<void> | void
}

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onSuccess()
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
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="termsAccepted" />
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
          </Field>
          <Field>
            <Button type="submit" className="h-12 w-full rounded-xl">
              Create Account
            </Button>
            <p className="mt-3.5 text-center text-caption leading-4 text-text-disabled">
              Complete all fields and accept the terms to continue.
            </p>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}
