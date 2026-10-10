import * as React from 'react';
import { ArrowLeft, ArrowRight, Clock3, MailCheck } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';
import { useResendOtp, useVerifyEmail } from '#/features/auth/hooks';

const OTP_LENGTH = 6;

interface VerifyEmailStepProps {
  email: string;
  onBack: () => void;
  onVerified: () => Promise<void> | void;
}

export function VerifyEmailStep({
  email,
  onBack,
  onVerified,
}: VerifyEmailStepProps) {
  const [otp, setOtp] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(
    'Account created. We sent a verification code to your email.',
  );

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendOtp();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Enter the complete 6-digit verification code.');
      return;
    }

    try {
      const result = await verifyMutation.mutateAsync({ email, otp });

      if (!result.success) {
        setErrorMessage(result.message || 'Email verification failed.');
        return;
      }

      await onVerified();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not verify your email. Please try again.',
      );
    }
  }

  async function handleResend() {
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await resendMutation.mutateAsync({ email });

      if (!result.success) {
        setErrorMessage('Could not resend the code. Please try again later.');
        return;
      }

      setOtp('');
      setStatusMessage('A new verification code has been requested.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not resend the code. Please try again later.',
      );
    }
  }

  const isBusy = verifyMutation.isPending || resendMutation.isPending;

  return (
    <>
      <div className="flex size-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
        <MailCheck className="size-6" />
      </div>

      <p className="mt-4 text-caption font-bold uppercase tracking-widest text-accent">
        Email verification
      </p>

      <h1 className="mt-1 font-heading text-heading-1 font-bold leading-[34px]">
        Verify your email
      </h1>

      <p className="mt-2 text-sm leading-[22px] text-text-tertiary">
        Enter the verification code sent to
      </p>
      <p className="mt-0.5 break-all text-sm font-semibold text-foreground">
        {email}
      </p>

      {statusMessage && (
        <p role="status" className="mt-3 text-sm text-accent">
          {statusMessage}
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8">
        <FieldGroup>
          <Field>
            <FieldLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              6-digit verification code
            </FieldLabel>
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(value) => {
                setOtp(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
                setErrorMessage(null);
              }}
              containerClassName="mt-2 justify-center"
              aria-label="6-digit verification code"
              disabled={isBusy}
              required
            >
              <InputOTPGroup>
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-14 text-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </Field>

          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Clock3 className="size-3.5 text-accent" />
            Code expires in 10 minutes
          </div>

          <Field>
            <Button
              type="submit"
              className="h-12 rounded-xl"
              disabled={isBusy || otp.length !== OTP_LENGTH}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="size-4" />
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="mt-5 text-center text-sm text-text-tertiary">
        Didn&apos;t receive the verification code?{' '}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 font-semibold text-accent"
          onClick={() => void handleResend()}
          disabled={isBusy}
        >
          {resendMutation.isPending ? 'Sending...' : 'Resend'}
        </Button>
      </p>

      <Button
        type="button"
        variant="link"
        onClick={onBack}
        className="mt-6"
        disabled={isBusy}
      >
        <ArrowLeft className="size-4" />
        Back to account details
      </Button>
    </>
  );
}
