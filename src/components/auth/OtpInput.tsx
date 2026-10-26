import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';

export function OtpInput({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <InputOTP
      maxLength={6}
      pattern="[0-9]*"
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus
      value={value}
      onBlur={onBlur}
      onChange={(nextValue) =>
        onChange(nextValue.replace(/\D/g, '').slice(0, 6))
      }
      containerClassName="w-full"
      aria-label="6-digit verification code"
    >
      <InputOTPGroup className="flex w-full gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-14 min-w-0 flex-1 rounded-xl border-border-input bg-bg-surface text-lg text-text-primary data-[active=true]:border-accent data-[active=true]:ring-1 data-[active=true]:ring-accent/30"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
