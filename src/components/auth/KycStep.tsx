import * as React from 'react'
import {
  CalendarDays,
  Check,
  FileText,
  LoaderCircle,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf']

export type KycStatus = 'not-submitted' | 'pending'

interface KycStepProps {
  email: string
  onComplete: (status: KycStatus) => Promise<void> | void
}

interface KycFormData {
  legalName: string
  identityNumber: string
  country: string
  dateOfBirth: string
}

const INITIAL_FORM: KycFormData = {
  legalName: '',
  identityNumber: '',
  country: '',
  dateOfBirth: '',
}

const COUNTRIES = [
  'United Arab Emirates',
  'Bahrain',
  'Kuwait',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'Sri Lanka',
  'United Kingdom',
  'United States',
]

export function KycStep({ email, onComplete }: KycStepProps) {
  const [formData, setFormData] = React.useState(INITIAL_FORM)
  const [document, setDocument] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState('')
  const [isDragging, setIsDragging] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dateInputRef = React.useRef<HTMLInputElement>(null)

  const isFormValid =
    Object.values(formData).every(Boolean) && Boolean(document) && !fileError

  function updateField(field: keyof KycFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  function selectDocument(file?: File) {
    if (!file) {
      return
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setDocument(null)
      setFileError('Choose a PNG, JPG, or PDF file.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setDocument(null)
      setFileError('The document must be 10 MB or smaller.')
      return
    }

    setDocument(file)
    setFileError('')
  }

  async function submitStatus(status: KycStatus) {
    setIsSubmitting(true)

    try {
      await onComplete(status)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    await submitStatus('pending')
  }

  const inputClassName =
    'h-12 rounded-2xl border-input bg-secondary px-4 text-sm text-foreground shadow-none placeholder:text-text-disabled focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20'

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            Step 3 · Optional identity verification
          </p>
          <h1 className="mt-1 font-heading text-[26px] font-bold leading-[34px]">
            Verify your identity
          </h1>
        </div>

        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
          <ShieldCheck className="size-[22px]" />
        </span>
      </div>

      <p className="mt-2 text-sm leading-[22px] text-text-tertiary">
        Verify your identity to unlock higher trading limits and wallet payouts
        for <span className="font-medium text-foreground">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-4">
          <FormField label="Legal full name" htmlFor="legalName">
            <Input
              id="legalName"
              autoComplete="name"
              placeholder="Name as shown on your ID"
              value={formData.legalName}
              onChange={(event) => updateField('legalName', event.target.value)}
              className={inputClassName}
            />
          </FormField>

          <FormField label="National ID / Passport" htmlFor="identityNumber">
            <Input
              id="identityNumber"
              autoComplete="off"
              placeholder="Enter document number"
              value={formData.identityNumber}
              onChange={(event) =>
                updateField('identityNumber', event.target.value)
              }
              className={inputClassName}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Country" htmlFor="country">
              <select
                id="country"
                value={formData.country}
                onChange={(event) => updateField('country', event.target.value)}
                className={cn(
                  inputClassName,
                  'w-full appearance-none pr-9 outline-none',
                  !formData.country && 'text-text-disabled',
                )}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Date of birth" htmlFor="dateOfBirth">
              <div className="relative">
                <Input
                  ref={dateInputRef}
                  id="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  max={new Date().toISOString().slice(0, 10)}
                  value={formData.dateOfBirth}
                  onChange={(event) =>
                    updateField('dateOfBirth', event.target.value)
                  }
                  className={cn(
                    inputClassName,
                    'pr-12 [&::-webkit-calendar-picker-indicator]:hidden',
                  )}
                />
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker()}
                  aria-label="Open date picker"
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-disabled transition hover:bg-foreground/[0.06] hover:text-foreground"
                >
                  <CalendarDays className="size-4" />
                </button>
              </div>
            </FormField>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground">
              Identity document
            </p>

            {document ? (
              <div className="mt-1.5 flex min-h-20 items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.08] px-4 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <FileText className="size-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {document.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-tertiary">
                    {(document.size / 1024 / 1024).toFixed(2)} MB · Ready to
                    upload
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setDocument(null)}
                  aria-label="Remove selected document"
                  className="flex size-8 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-white/[0.06] hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDragging(false)
                  selectDocument(event.dataTransfer.files[0])
                }}
                className={cn(
                  'mt-1.5 flex min-h-28 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-strong bg-secondary/60 px-4 text-center transition',
                  'hover:border-accent/60 hover:bg-accent/[0.05]',
                  isDragging && 'border-accent bg-accent/[0.08]',
                )}
              >
                <UploadCloud className="size-6 text-accent" />
                <span className="mt-2 text-sm font-semibold">
                  Drop your document here or{' '}
                  <span className="text-accent">browse</span>
                </span>
                <span className="mt-1 text-xs text-text-tertiary">
                  PNG, JPG, PDF up to 10 MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
              onChange={(event) => selectDocument(event.target.files?.[0])}
              className="sr-only"
            />

            {fileError ? (
              <p
                role="alert"
                className="mt-1.5 text-xs text-feedback-error-text"
              >
                {fileError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => submitStatus('not-submitted')}
            className="h-12 rounded-xl border-strong bg-transparent text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Skip for Now
          </Button>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="h-12 rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/30 disabled:text-text-tertiary"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit KYC
                <Check className="size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-[0.025em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
