import { revalidateLogic, useForm } from '@tanstack/react-form';
import { ArrowLeft, ArrowRight, Clock3, MailCheck } from 'lucide-react';

import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';
import { toast } from '#/components/ui/toast';
import { useResendOtp, useVerifyEmail } from '#/features/auth/hooks';
import { verifyEmailSchema } from '#/features/auth/schemas';
import type { VerifyEmailFormValues } from '#/features/auth/schemas';
import {
  formatFieldError,
  getApiFieldErrors,
  getGeneralFormError,
  getRequestIdError,
} from '#/lib/form-errors';
import { VERIFY_EMAIL_ERROR_FIELDS } from '#/features/auth/errors';

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
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendOtp();

  const form = useForm({
    defaultValues: { otp: '' } satisfies VerifyEmailFormValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: verifyEmailSchema },
    onSubmit: async ({ value }) => {
      resendMutation.reset();
      await verifyMutation.mutateAsync({ email, otp: value.otp });
      await onVerified();
    },
  });

  async function handleResend() {
    verifyMutation.reset();

    try {
      await resendMutation.mutateAsync({ email });
    } catch {
      // Shown below the code field from the mutation state.
      return;
    }

    form.reset();
    toast.add({
      title: 'A new verification code has been sent.',
      type: 'success',
    });
  }

  const submitError = verifyMutation.error ?? resendMutation.error;
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
      <p role="status" className="mt-3 text-sm text-accent">
        Account created. We sent a verification code to your email.
      </p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        className="mt-8"
      >
        <FieldGroup>
          <form.Field name="otp">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel
                  htmlFor={field.name}
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  6-digit verification code
                </FieldLabel>
                <InputOTP
                  id={field.name}
                  maxLength={OTP_LENGTH}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => {
                    verifyMutation.reset();
                    resendMutation.reset();
                    field.handleChange(value.replace(/\D/g, ''));
                  }}
                  containerClassName="mt-2 justify-center"
                  aria-label="6-digit verification code"
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(verifyMutation.error, 'otp').length > 0
                  }
                  disabled={isBusy}
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
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(verifyMutation.error, 'otp'),
                  ]}
                />
              </Field>
            )}
          </form.Field>

          {getGeneralFormError(submitError, VERIFY_EMAIL_ERROR_FIELDS) ? (
            <FieldError>
              {getGeneralFormError(submitError, VERIFY_EMAIL_ERROR_FIELDS)}
            </FieldError>
          ) : null}
          {getRequestIdError(submitError) ? (
            <p className="text-xs text-text-disabled">
              {getRequestIdError(submitError)}
            </p>
          ) : null}

          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Clock3 className="size-3.5 text-accent" />
            Code expires in 10 minutes
          </div>

          <Field>
            <form.Subscribe
              selector={(state) =>
                [state.isSubmitting, state.values.otp] as const
              }
            >
              {([isSubmitting, otp]) => (
                <Button
                  type="submit"
                  className="h-12 rounded-xl"
                  disabled={isBusy || isSubmitting || otp.length !== OTP_LENGTH}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Email'}
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </form.Subscribe>
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
