import { useForm } from '@tanstack/react-form';
import { Save, UserRound } from 'lucide-react';

import {
  useUserProfile,
  useUpdateProfile,
  useRequestEmailChange,
} from '#/features/auth/hooks';
import type { UserProfile } from '#/features/auth/api';
import {
  createEmailChangeSchema,
  updateProfileSchema,
} from '#/features/auth/schemas';
import type {
  EmailChangeFormValues,
  UpdateProfileFormValues,
} from '#/features/auth/schemas';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';
import { toast } from '../ui/toast';
import {
  formatFieldError,
  getApiFieldErrors,
  getErrorMessage,
} from '#/utils/errors';

export default function PersonalInformation() {
  const profileQuery = useUserProfile();
  const profile = profileQuery.data;

  const initials = (profile?.name || profile?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-4 text-brand-primary" />
          Personal information
        </CardTitle>
        <CardDescription>
          Manage your account name and email address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {profileQuery.isPending ? (
          <p className="text-sm text-text-tertiary">Loading your profile...</p>
        ) : profileQuery.isError || !profile ? (
          <div className="space-y-3">
            <p className="text-sm text-feedback-error-text">
              Unable to load your profile.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void profileQuery.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-border bg-bg-elevated p-4">
              <Avatar className="size-16 border-[3px] border-accent/30 bg-accent">
                <AvatarFallback className="bg-accent font-bold text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold">
                  {profile.name || 'Your account'}
                </p>
                <p className="truncate text-sm text-text-tertiary">
                  {profile.email}
                </p>
                <p className="mt-1 text-xs text-text-tertiary">
                  Account status: {profile.status}
                </p>
              </div>
            </div>

            <ProfileNameForm profile={profile} />

            <div className="border-t border-border pt-5">
              <h3 className="font-semibold">Change email address</h3>
              <p className="mt-1 text-sm text-text-tertiary">
                We will send a verification link to your new address.
              </p>

              <EmailChangeForm currentEmail={profile.email} />
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="font-semibold">Phone and region</h3>
              <p className="mt-1 text-sm text-text-tertiary">
                These details are not currently supported by the account API, so
                they cannot be saved from this page.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileNameForm({ profile }: { profile: UserProfile }) {
  const updateMutation = useUpdateProfile();

  const form = useForm({
    defaultValues: { name: profile.name } satisfies UpdateProfileFormValues,
    validators: { onSubmit: updateProfileSchema },
    onSubmit: async ({ value, formApi }) => {
      const name = value.name.trim();

      try {
        await updateMutation.mutateAsync({ name });
        formApi.reset({ name });
        toast.add({ title: 'Profile name updated.', type: 'success' });
      } catch (error) {
        toast.add({
          title: getErrorMessage(error, 'Unable to update your profile.'),
          type: 'error',
        });
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const errors = [
              ...field.state.meta.errors.map(formatFieldError),
              ...getApiFieldErrors(updateMutation.error, field.name),
            ];

            return (
              <Field data-invalid={errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    updateMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={errors.length > 0}
                />
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <Field>
          <FieldLabel htmlFor="currentEmail">Current email</FieldLabel>
          <Input
            id="currentEmail"
            type="email"
            value={profile.email}
            readOnly
          />
          <FieldDescription>
            Your email stays unchanged until you verify the new address.
          </FieldDescription>
        </Field>

        <Field orientation="horizontal">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.isDefaultValue]}
          >
            {([isSubmitting, isDefaultValue]) => (
              <Button
                type="submit"
                className="px-4"
                disabled={isSubmitting || isDefaultValue}
              >
                <Save className="size-4" />
                {isSubmitting ? 'Saving...' : 'Save name'}
              </Button>
            )}
          </form.Subscribe>
        </Field>
      </FieldGroup>
    </form>
  );
}

function EmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const emailMutation = useRequestEmailChange();

  const form = useForm({
    defaultValues: { newEmail: '' } satisfies EmailChangeFormValues,
    validators: { onSubmit: createEmailChangeSchema(currentEmail) },
    onSubmit: async ({ value, formApi }) => {
      try {
        await emailMutation.mutateAsync({
          newEmail: value.newEmail.trim().toLowerCase(),
        });
        formApi.reset();
        toast.add({
          title:
            'Verification link sent. Check the new email address to confirm the change.',
          type: 'success',
        });
      } catch (error) {
        toast.add({
          title: getErrorMessage(error, 'Unable to request an email change.'),
          type: 'error',
        });
      }
    },
  });

  return (
    <form
      className="mt-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="newEmail">
          {(field) => {
            const errors = [
              ...field.state.meta.errors.map(formatFieldError),
              ...getApiFieldErrors(emailMutation.error, field.name),
            ];

            return (
              <Field data-invalid={errors.length > 0}>
                <FieldLabel htmlFor={field.name}>New email address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    emailMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={errors.length > 0}
                />
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <Field orientation="horizontal">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="outline" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send verification link'}
              </Button>
            )}
          </form.Subscribe>
        </Field>
      </FieldGroup>
    </form>
  );
}
