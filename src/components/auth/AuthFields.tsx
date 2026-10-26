import type { InputHTMLAttributes, ReactNode } from 'react';

import { Input } from '#/components/ui/input';
import { PasswordInput } from '#/components/ui/password-input';

interface AuthFieldFrameProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  children: ReactNode;
}

function AuthFieldFrame({
  id,
  label,
  hint,
  error,
  trailing,
  children,
}: AuthFieldFrameProps) {
  const helperId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[13px] leading-[18px] font-semibold text-text-secondary"
        >
          {label}
        </label>
        {trailing}
      </div>
      {children}
      {error ? (
        <p
          id={helperId}
          role="alert"
          className="text-xs leading-4 text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={helperId} className="text-xs leading-4 text-text-disabled">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
};

export function TextField({
  id,
  label,
  hint,
  error,
  trailing,
  className,
  ...props
}: TextFieldProps) {
  const helperId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <AuthFieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      trailing={trailing}
    >
      <Input
        {...props}
        id={id}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={helperId}
        className={`h-[52px] rounded-2xl border-border-input bg-bg-surface px-4 text-base text-text-primary shadow-none placeholder:text-text-disabled focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 ${className ?? ''}`}
      />
    </AuthFieldFrame>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, 'type'>;

export function PasswordField({
  id,
  label,
  hint,
  error,
  trailing,
  className,
  ...props
}: PasswordFieldProps) {
  const helperId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <AuthFieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      trailing={trailing}
    >
      <PasswordInput
        {...props}
        id={id}
        aria-describedby={helperId}
        aria-invalid={error ? true : props['aria-invalid']}
        className={`h-[52px] rounded-2xl border-border-input bg-bg-surface text-base text-text-primary shadow-none placeholder:text-text-disabled ${className ?? ''}`}
        innerClass="px-4"
      />
    </AuthFieldFrame>
  );
}
