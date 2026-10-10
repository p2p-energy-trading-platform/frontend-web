import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import { useRegister } from '#/features/auth/hooks';
import { registerSchema } from '#/features/auth/schemas';
import type { RegisterFormValues } from '#/features/auth/schemas';
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
import { toast } from '#/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { LegalDocument } from '#/components/legal/LegalDocument';
import {
  formatFieldError,
  getApiFieldErrors,
  getGeneralFormError,
  getRequestIdError,
} from '#/utils/errors';

interface CreateAccountFormProps {
  onSuccess: (email: string) => Promise<void> | void;
}

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const registerMutation = useRegister();
  const [activeLegal, setActiveLegal] = useState<'terms' | 'privacy' | null>(
    null,
  );
  const defaultValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync({
        email: value.email,
        password: value.password,
      });
      toast.add({
        title: 'Account created. We sent a verification code to your email.',
        type: 'success',
      });
      await onSuccess(value.email);
    },
  });

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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        noValidate
        className="my-6"
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(registerMutation.error, 'email').length >
                      0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map((error) => ({
                      ...formatFieldError(error),
                    })),
                    ...getApiFieldErrors(registerMutation.error, 'email'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field
            name="password"
            validators={{
              onSubmit: ({ value }) =>
                value.length < 8 || value.length > 128
                  ? 'Password must be 8 to 128 characters'
                  : undefined,
            }}
          >
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(registerMutation.error, 'password')
                      .length > 0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map((error) => ({
                      ...formatFieldError(error),
                    })),
                    ...getApiFieldErrors(registerMutation.error, 'password'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="h-12 rounded-2xl"
                  innerClass="px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    registerMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError
                  errors={field.state.meta.errors.map((error) => ({
                    ...formatFieldError(error),
                  }))}
                />
              </Field>
            )}
          </form.Field>
          <form.Field
            name="termsAccepted"
            validators={{
              onSubmit: ({ value }) =>
                value ? undefined : 'You must accept the terms to continue',
            }}
          >
            {(field) => (
              <Field className="gap-1">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    aria-label="I agree to the GridX Terms and Privacy Policy"
                    aria-invalid={field.state.meta.errors.length > 0}
                    onCheckedChange={(checked) => {
                      registerMutation.reset();
                      field.handleChange(checked === true);
                    }}
                  />
                  <div className="text-sm leading-6 text-text-secondary">
                    <span>I agree to the </span>
                    <button
                      type="button"
                      className="font-semibold text-accent hover:underline"
                      onClick={() => setActiveLegal('terms')}
                    >
                      GridX Terms
                    </button>
                    <span> and </span>
                    <button
                      type="button"
                      className="font-semibold text-accent hover:underline"
                      onClick={() => setActiveLegal('privacy')}
                    >
                      Privacy Policy
                    </button>
                  </div>
                </div>
                <Dialog
                  open={activeLegal !== null}
                  onOpenChange={(open) => {
                    if (!open) setActiveLegal(null);
                  }}
                >
                  <DialogContent className="flex h-[85vh] w-[95vw] max-h-[85vh] max-w-6xl flex-col gap-4 overflow-hidden p-6 sm:p-8">
                    <DialogHeader className="shrink-0 pr-8">
                      <DialogTitle>
                        {activeLegal === 'terms'
                          ? 'GridX Terms of Service'
                          : 'GridX Privacy Policy'}
                      </DialogTitle>
                      <DialogDescription>
                        Review the document below. Close this dialog to return
                        to your account registration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3">
                      {activeLegal && <LegalDocument type={activeLegal} />}
                    </div>
                  </DialogContent>
                </Dialog>
                <FieldError
                  className="ml-6"
                  errors={field.state.meta.errors.map((error) =>
                    formatFieldError(error),
                  )}
                />
              </Field>
            )}
          </form.Field>
          {getGeneralFormError(registerMutation.error) ? (
            <FieldError>
              {getGeneralFormError(registerMutation.error)}
            </FieldError>
          ) : null}
          {getRequestIdError(registerMutation.error) ? (
            <p className="text-xs text-text-disabled">
              {getRequestIdError(registerMutation.error)}
            </p>
          ) : null}
          <Field>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={registerMutation.isPending}
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
