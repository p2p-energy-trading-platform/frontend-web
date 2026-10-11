import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import { useVerifyEmailChange } from '#/features/auth/hooks';
import { Button } from '#/components/ui/button';
import { toast } from '#/components/ui/toast';
import { getErrorMessage } from '#/utils/errors';

export default function VerifyEmailChangeView() {
  const mutation = useVerifyEmailChange();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  async function verify() {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      toast.add({
        title: 'This verification link is missing its token.',
        type: 'error',
      });
      return;
    }

    try {
      const profile = await mutation.mutateAsync({ token });
      setCompleted(true);
      toast.add({
        title: `Email address updated to ${profile.email}.`,
        type: 'success',
      });
    } catch (error) {
      toast.add({
        title: getErrorMessage(
          error,
          'Unable to verify this email address. The link may have expired.',
        ),
        type: 'error',
      });
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg px-5 py-12">
      <div className="rounded-2xl border border-border bg-bg-canvas p-6 sm:p-8">
        <h1 className="font-heading text-heading-1">Verify email change</h1>
        <p className="mt-3 text-sm text-text-tertiary">
          Confirm that you want to use the new email address for your GridX
          account.
        </p>

        {completed ? (
          <>
            <p className="mt-5 text-sm">
              Your email address has been verified and updated successfully.
            </p>
            <Button
              type="button"
              className="mt-6 w-full"
              onClick={() => void navigate({ to: '/sign-in' })}
            >
              Go to sign in
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              className="mt-6 w-full"
              disabled={mutation.isPending}
              onClick={() => void verify()}
            >
              {mutation.isPending ? 'Verifying...' : 'Verify new email'}
            </Button>
            <p className="mt-5 text-center text-sm text-text-tertiary">
              <Link
                to="/sign-in"
                className="font-semibold text-accent hover:underline"
              >
                Return to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
