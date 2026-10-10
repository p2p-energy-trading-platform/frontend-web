import { useState } from 'react';
import type { FormEvent } from 'react';
import { LockKeyhole, Save } from 'lucide-react';

import { useChangePassword, useLogout } from '#/features/auth/hooks';
import { ApiError } from '#/lib/api-client';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import { toast } from '../ui/toast';

export default function Security() {
  const changeMutation = useChangePassword();
  const logoutMutation = useLogout();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.add({
        title: 'Your new password must contain at least 8 characters.',
        type: 'error',
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast.add({
        title: 'Choose a new password different from your current password.',
        type: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.add({ title: 'The new passwords do not match.', type: 'error' });
      return;
    }

    try {
      await changeMutation.mutateAsync({ currentPassword, newPassword });

      // Clear the session cookies and frontend authentication cache.
      await logoutMutation.mutateAsync();

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Navigate to sign-in with a full page load.
      window.location.assign('/sign-in');
    } catch (error) {
      toast.add({
        title:
          error instanceof ApiError || error instanceof Error
            ? error.message
            : 'Unable to change your password. Please try again.',
        type: 'error',
      });
    }
  }

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
        <form className="space-y-5" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current password
              </FieldLabel>
              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm new password
                </FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Field>
            </div>

            <Field orientation="horizontal">
              <Button
                type="submit"
                className="px-4"
                disabled={changeMutation.isPending}
              >
                <Save className="size-4" />
                {changeMutation.isPending ? 'Changing...' : 'Change password'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
