import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Save, UserRound } from 'lucide-react';

import {
  useUserProfile,
  useUpdateProfile,
  useRequestEmailChange,
} from '#/features/auth/hooks';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { toast } from '../ui/toast';
import { getErrorMessage } from '#/utils/errors';

export default function PersonalInformation() {
  const profileQuery = useUserProfile();
  const updateMutation = useUpdateProfile();
  const emailMutation = useRequestEmailChange();

  const profile = profileQuery.data;
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile?.name]);

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      toast.add({ title: 'Name is required.', type: 'error' });
      return;
    }

    try {
      await updateMutation.mutateAsync({ name: normalizedName });
      setName(normalizedName);
      toast.add({ title: 'Profile name updated.', type: 'success' });
    } catch (error) {
      toast.add({
        title: getErrorMessage(error, 'Unable to update your profile.'),
        type: 'error',
      });
    }
  }

  async function requestEmailUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!normalizedEmail) return;

    if (normalizedEmail === profile?.email.toLowerCase()) {
      toast.add({
        title: 'Enter an email address different from your current one.',
        type: 'error',
      });
      return;
    }

    try {
      await emailMutation.mutateAsync({ newEmail: normalizedEmail });
      setNewEmail('');
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
  }

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

            <form className="space-y-4" onSubmit={saveName}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={name}
                    maxLength={100}
                    required
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="currentEmail">Current email</FieldLabel>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={profile.email}
                    readOnly
                    aria-describedby="email-change-help"
                  />
                  <p
                    id="email-change-help"
                    className="text-xs text-text-tertiary"
                  >
                    Your email stays unchanged until you verify the new address.
                  </p>
                </Field>

                <Field orientation="horizontal">
                  <Button
                    type="submit"
                    className="px-4"
                    disabled={
                      updateMutation.isPending ||
                      !name.trim() ||
                      name.trim() === profile.name
                    }
                  >
                    <Save className="size-4" />
                    {updateMutation.isPending ? 'Saving...' : 'Save name'}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            <div className="border-t border-border pt-5">
              <h3 className="font-semibold">Change email address</h3>
              <p className="mt-1 text-sm text-text-tertiary">
                We will send a verification link to your new address.
              </p>

              <form className="mt-4 space-y-4" onSubmit={requestEmailUpdate}>
                <Field>
                  <FieldLabel htmlFor="newEmail">New email address</FieldLabel>
                  <Input
                    id="newEmail"
                    type="email"
                    name="newEmail"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={newEmail}
                    required
                    onChange={(event) => setNewEmail(event.target.value)}
                  />
                </Field>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={emailMutation.isPending || !newEmail.trim()}
                >
                  {emailMutation.isPending
                    ? 'Sending...'
                    : 'Send verification link'}
                </Button>
              </form>
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
