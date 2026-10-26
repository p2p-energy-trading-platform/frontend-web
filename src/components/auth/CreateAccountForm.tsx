import { revalidateLogic, useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import { AuthDivider } from '#/components/auth/AuthDivider';
import { GoogleButton } from '#/components/auth/GoogleButton';
import { PasswordField, TextField } from '#/components/auth/AuthFields';
import { TermsCheckbox } from '#/components/auth/TermsCheckbox';
import { Button } from '#/components/ui/button';
import { FieldGroup } from '#/components/ui/field';
import { toast } from '#/components/ui/toast';
import { createAccountSchema } from '#/features/auth/schemas';
import type { CreateAccountValues } from '#/features/auth/schemas';
import { formatFieldError } from '#/lib/form-errors';

interface CreateAccountFormProps {
  initialEmail?: string;
  onSuccess: (email: string) => Promise<void> | void;
}

function firstError(errors: unknown[]) {
  return errors.length > 0
    ? formatFieldError(errors[0]).message || undefined
    : undefined;
}

export function CreateAccountForm({
  initialEmail = '',
  onSuccess,
}: CreateAccountFormProps) {
  const defaultValues: CreateAccountValues = {
    email: initialEmail,
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  };
  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: createAccountSchema },
    onSubmit: async ({ value }) => {
      await onSuccess(value.email.trim());
    },
  });

  return (
    <div className="flex flex-1 flex-col">
      <header>
        <h1 className="font-heading text-[28px] leading-9 font-bold text-text-primary">
          Create your account
        </h1>
        <p className="mt-2 text-[15px] leading-[22px] text-text-secondary">
          Enter your email and choose a password.
        </p>
      </header>

      <form
        noValidate
        className="mt-5"
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
                autoComplete="new-password"
                placeholder="Create a strong password"
                hint="At least 8 characters, with a letter and a number."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={firstError(field.state.meta.errors)}
              />
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <PasswordField
                id={field.name}
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={firstError(field.state.meta.errors)}
              />
            )}
          </form.Field>

          <form.Field name="termsAccepted">
            {(field) => (
              <TermsCheckbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                error={firstError(field.state.meta.errors)}
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.isValid, state.isSubmitting] as const}
          >
            {([isValid, isSubmitting]) => (
              <Button
                type="submit"
                className="h-[52px] w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90"
                disabled={!isValid || isSubmitting}
              >
                Create account
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
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

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-semibold text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
