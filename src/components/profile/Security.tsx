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
import { toast } from '../ui/toast';
import {
  formatFieldError,
  getApiFieldErrors,
  getErrorMessage,
} from '#/utils/errors';

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
      try {
        await changeMutation.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });

        // Clear the session cookies and frontend authentication cache.
        await logoutMutation.mutateAsync();

        // Navigate to sign-in with a full page load.
        window.location.assign('/sign-in');
      } catch (error) {
        toast.add({
          title: getErrorMessage(
            error,
            'Unable to change your password. Please try again.',
          ),
          type: 'error',
        });
      }
    },
  });

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
              {(field) => {
                const errors = [
                  ...field.state.meta.errors.map(formatFieldError),
                  ...getApiFieldErrors(changeMutation.error, field.name),
                ];

                return (
                  <Field data-invalid={errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>
                      Current password
                    </FieldLabel>
                    <PasswordInput
                      id={field.name}
                      name={field.name}
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        changeMutation.reset();
                        field.handleChange(event.target.value);
                      }}
                      aria-invalid={errors.length > 0}
                    />
                    <FieldError errors={errors} />
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="newPassword">
                {(field) => {
                  const errors = [
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(changeMutation.error, field.name),
                  ];

                  return (
                    <Field data-invalid={errors.length > 0}>
                      <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          changeMutation.reset();
                          field.handleChange(event.target.value);
                        }}
                        aria-invalid={errors.length > 0}
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm new password
                    </FieldLabel>
                    <PasswordInput
                      id={field.name}
                      name={field.name}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    <FieldError
                      errors={field.state.meta.errors.map(formatFieldError)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

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
