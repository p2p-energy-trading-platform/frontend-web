import { Mail } from 'lucide-react';
import { useState } from 'react';

import { OtpInput } from '#/components/auth/OtpInput';
import { Button } from '#/components/ui/button';
import { toast } from '#/components/ui/toast';

interface VerifyEmailStepProps {
  email: string;
  onBack: () => void;
  onVerified: () => Promise<void> | void;
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  return `${localPart.slice(0, 2)}•••••••••••@${domain}`;
}

export function VerifyEmailStep({
  email,
  onBack,
  onVerified,
}: VerifyEmailStepProps) {
  const [otp, setOtp] = useState('');

  return (
    <div className="flex min-h-full flex-col">
      <header>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-feedback-info-border bg-feedback-info-background text-feedback-info-icon">
          <Mail className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-heading text-[28px] leading-9 font-bold text-text-primary">
          Verify your email
        </h1>
        <p className="mt-1 text-[15px] leading-[22px] text-text-secondary">
          We sent a 6-digit code to
          <br />
          <span className="font-semibold text-text-primary">
            {maskEmail(email)}
          </span>
          .
        </p>
      </header>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (otp.length === 6) void onVerified();
        }}
      >
        <OtpInput value={otp} onChange={setOtp} />
        <p className="mt-3 text-sm leading-[20px] text-text-disabled">
          The code expires in 10 minutes. Check your spam folder if you
          don&apos;t see it.
        </p>
        <Button
          type="submit"
          className="mt-6 h-[52px] w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          disabled={otp.length !== 6}
        >
          Verify email
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-secondary">
        Didn&apos;t get a code?{' '}
        <button
          type="button"
          className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() =>
            toast.add({
              title: 'Email delivery is not connected in this preview.',
              type: 'info',
            })
          }
        >
          Resend code
        </button>
      </p>

      <p className="mt-auto pt-8 text-center text-sm text-text-secondary">
        Wrong email?{' '}
        <button
          type="button"
          className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={onBack}
        >
          Change email address
        </button>
      </p>
    </div>
  );
}
