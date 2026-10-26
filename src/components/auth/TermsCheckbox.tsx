import { Link } from '@tanstack/react-router';

import { Checkbox } from '#/components/ui/checkbox';

export function TermsCheckbox({
  id,
  checked,
  onCheckedChange,
  error,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-5 rounded-md border-border-input bg-bg-surface data-checked:border-accent data-checked:bg-accent"
          onCheckedChange={(value) => onCheckedChange(value === true)}
        />
        <label
          htmlFor={id}
          className="min-w-0 cursor-pointer text-sm leading-6 text-text-secondary"
        >
          I agree to the{' '}
          <Link
            to="/terms"
            className="font-semibold text-accent hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="font-semibold text-accent hover:underline"
          >
            Privacy Policy
          </Link>
          . I confirm I am 18 or over and a UAE resident.
        </label>
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs leading-4 text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
