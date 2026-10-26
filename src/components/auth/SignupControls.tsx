import { ChevronDown, FileCheck2, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

import { cn } from 'cn';

export interface SelectOption {
  label: string;
  value: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[13px] leading-[18px] font-semibold text-text-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'h-12 w-full appearance-none rounded-2xl border border-border-input bg-bg-surface px-4 pr-10 text-base shadow-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20',
            value ? 'text-text-primary' : 'text-text-disabled',
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-disabled"
        />
      </div>
    </div>
  );
}

export interface DateFieldValue {
  day: string;
  month: string;
  year: string;
}

export function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: DateFieldValue;
  onChange: (value: DateFieldValue) => void;
}) {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  function updatePart(part: keyof DateFieldValue, rawValue: string) {
    const maxLength = part === 'year' ? 4 : 2;
    const nextValue = rawValue.replace(/\D/g, '').slice(0, maxLength);
    onChange({ ...value, [part]: nextValue });

    if (nextValue.length === maxLength) {
      const nextInput =
        part === 'day'
          ? monthRef.current
          : part === 'month'
            ? yearRef.current
            : null;
      nextInput?.focus();
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={`${id}-day`}
        className="text-[13px] leading-[18px] font-semibold text-text-secondary"
      >
        {label}
      </label>
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-border-input bg-bg-surface px-4 text-base text-text-primary focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <input
          ref={dayRef}
          id={`${id}-day`}
          aria-label="Day"
          autoComplete="bday-day"
          inputMode="numeric"
          maxLength={2}
          placeholder="DD"
          value={value.day}
          onChange={(event) => updatePart('day', event.target.value)}
          className="w-7 min-w-0 bg-transparent text-center outline-none placeholder:text-text-disabled"
        />
        <span aria-hidden="true" className="text-text-disabled">
          /
        </span>
        <input
          ref={monthRef}
          aria-label="Month"
          autoComplete="bday-month"
          inputMode="numeric"
          maxLength={2}
          placeholder="MM"
          value={value.month}
          onChange={(event) => updatePart('month', event.target.value)}
          className="w-7 min-w-0 bg-transparent text-center outline-none placeholder:text-text-disabled"
        />
        <span aria-hidden="true" className="text-text-disabled">
          /
        </span>
        <input
          ref={yearRef}
          aria-label="Year"
          autoComplete="bday-year"
          inputMode="numeric"
          maxLength={4}
          placeholder="YYYY"
          value={value.year}
          onChange={(event) => updatePart('year', event.target.value)}
          className="w-12 min-w-0 bg-transparent text-center outline-none placeholder:text-text-disabled"
        />
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isSupportedDocument(file: File) {
  const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const supportedExtensions = /\.(jpe?g|png|pdf)$/i;
  return (
    supportedTypes.includes(file.type) || supportedExtensions.test(file.name)
  );
}

export function FileUploadRow({
  label,
  hint,
  file,
  onFileChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!selectedFile) return;

    if (!isSupportedDocument(selectedFile)) {
      onFileChange(null);
      setError('Choose a JPG, PNG or PDF file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      onFileChange(null);
      setError('File must be 5 MB or smaller.');
      return;
    }

    setError('');
    onFileChange(selectedFile);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        aria-label={`Upload ${label}`}
        className="sr-only"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-invalid={error ? true : undefined}
        className={cn(
          'flex min-h-16 w-full items-center gap-3 rounded-2xl border border-dashed border-border-input bg-bg-surface px-3 text-left transition-colors hover:border-accent focus-visible:ring-2 focus-visible:ring-ring/50',
          error && 'border-destructive',
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background-well text-text-disabled">
          {file ? (
            <FileCheck2 className="size-4 text-accent" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm leading-5 font-semibold text-text-primary">
            {file?.name ?? label}
          </span>
          <span className="block text-xs leading-4 text-text-disabled">
            {file ? formatFileSize(file.size) : hint}
          </span>
        </span>
        <span className="shrink-0 text-[13px] leading-[18px] font-semibold text-accent">
          {file ? 'Change' : 'Browse'}
        </span>
      </button>
      {error ? (
        <p role="alert" className="text-xs leading-4 text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OptionCard({
  title,
  subtitle,
  icon: Icon,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-28 min-w-0 flex-1 flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring/50',
        selected
          ? 'border-accent bg-accent/10'
          : 'border-border-input bg-bg-surface hover:border-accent/50',
      )}
    >
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-xl',
          selected
            ? 'bg-background-well text-accent'
            : 'bg-background-well text-text-disabled',
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="text-sm leading-5 font-semibold text-text-primary">
        {title}
      </span>
      <span className="text-xs leading-4 text-text-disabled">{subtitle}</span>
    </button>
  );
}
