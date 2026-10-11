import { Link, useNavigate } from '@tanstack/react-router';

import { useVerifyEmailChange } from '#/features/auth/hooks';
import { Button } from '#/components/ui/button';
import { FieldError } from '#/components/ui/field';
import { toast } from '#/components/ui/toast';
import { getGeneralFormError, getRequestIdError } from '#/lib/form-errors';

const MISSING_TOKEN_ERROR = 'This verification link is missing its token.';

export default function VerifyEmailChangeView() {
  const mutation = useVerifyEmailChange();
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  function verify() {
    if (!token) return;

    mutation.mutate(
      { token },
      {
        onSuccess: (profile) => {
          toast.add({
            title: `Email address updated to ${profile.email}.`,
            type: 'success',
          });
        },
      },
    );
  }

  return (
    <section className="mx-auto w-full max-w-lg px-5 py-12">
      <div className="rounded-2xl border border-border bg-bg-canvas p-6 sm:p-8">
        <h1 className="font-heading text-heading-1">Verify email change</h1>
        <p className="mt-3 text-sm text-text-tertiary">
          Confirm that you want to use the new email address for your GridX
          account.
        </p>

        {mutation.isSuccess ? (
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
            {!token ? (
              <FieldError className="mt-5">{MISSING_TOKEN_ERROR}</FieldError>
            ) : null}
            {getGeneralFormError(mutation.error) ? (
              <FieldError className="mt-5">
                {getGeneralFormError(mutation.error)}
              </FieldError>
            ) : null}
            {getRequestIdError(mutation.error) ? (
              <p className="mt-2 text-xs text-text-disabled">
                {getRequestIdError(mutation.error)}
              </p>
            ) : null}
            <Button
              type="button"
              className="mt-6 w-full"
              disabled={!token || mutation.isPending}
              onClick={verify}
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
