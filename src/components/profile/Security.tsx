import { useForm } from '@tanstack/react-form';
import { LockKeyhole, Save } from 'lucide-react';

import { useChangePassword, useLogout } from '#/features/auth/hooks';
import { changePasswordSchema } from '#/features/auth/schemas';
import type { ChangePasswordFormValues } from '#/features/auth/schemas';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import {
  formatFieldError,
  getApiFieldErrors,
  getGeneralFormError,
  getRequestIdError,
} from '#/lib/form-errors';
import { CHANGE_PASSWORD_ERROR_FIELDS } from '#/features/auth/errors';

export default function Security() {
  const changeMutation = useChangePassword();
  const logoutMutation = useLogout();

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } satisfies ChangePasswordFormValues,
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      await changeMutation.mutateAsync({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });

      // Clear the session cookies and frontend authentication cache.
      await logoutMutation.mutateAsync();

      // Navigate to sign-in with a full page load.
      window.location.assign('/sign-in');
    },
  });

  const submitError = changeMutation.error ?? logoutMutation.error;

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="size-4 text-brand-primary" />
          Security
        </CardTitle>
        <CardDescription>
          Use a unique password you do not use elsewhere.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="currentPassword">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      changeMutation.reset();
                      field.handleChange(event.target.value);
                    }}
                    aria-invalid={
                      field.state.meta.errors.length > 0 ||
                      getApiFieldErrors(changeMutation.error, 'currentPassword')
                        .length > 0
                    }
                  />
                  <FieldError
                    errors={[
                      ...field.state.meta.errors.map(formatFieldError),
                      ...getApiFieldErrors(
                        changeMutation.error,
                        'currentPassword',
                      ),
                    ]}
                  />
                </Field>
              )}
            </form.Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="newPassword">
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <PasswordInput
                      id={field.name}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        changeMutation.reset();
                        field.handleChange(event.target.value);
                      }}
                      aria-invalid={
                        field.state.meta.errors.length > 0 ||
                        getApiFieldErrors(changeMutation.error, 'newPassword')
                          .length > 0
                      }
                    />
                    <FieldError
                      errors={[
                        ...field.state.meta.errors.map(formatFieldError),
                        ...getApiFieldErrors(
                          changeMutation.error,
                          'newPassword',
                        ),
                      ]}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm new password
                    </FieldLabel>
                    <PasswordInput
                      id={field.name}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        changeMutation.reset();
                        field.handleChange(event.target.value);
                      }}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    <FieldError
                      errors={field.state.meta.errors.map(formatFieldError)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            {getGeneralFormError(submitError, CHANGE_PASSWORD_ERROR_FIELDS) ? (
              <FieldError>
                {getGeneralFormError(submitError, CHANGE_PASSWORD_ERROR_FIELDS)}
              </FieldError>
            ) : null}
            {getRequestIdError(submitError) ? (
              <p className="text-xs text-text-disabled">
                {getRequestIdError(submitError)}
              </p>
            ) : null}

            <Field orientation="horizontal">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="px-4"
                    disabled={isSubmitting}
                  >
                    <Save className="size-4" />
                    {isSubmitting ? 'Changing...' : 'Change password'}
                  </Button>
                )}
              </form.Subscribe>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
