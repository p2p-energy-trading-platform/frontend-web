import * as React from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

const createAccountSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Enter a valid email address'),

    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Z]/, 'Add at least one uppercase letter')
      .regex(/[a-z]/, 'Add at least one lowercase letter')
      .regex(/[0-9]/, 'Add at least one number'),

    confirmPassword: z.string().min(1, 'Confirm your password'),

    termsAccepted: z.literal(true, {
      error: 'Accept the GridX Terms and Privacy Policy to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type CreateAccountFormData = z.infer<typeof createAccountSchema>

type FieldName = keyof CreateAccountFormData
type FormErrors = Partial<Record<FieldName, string>>

interface CreateAccountFormProps {
  onSuccess: (data: CreateAccountFormData) => Promise<void> | void
  isLoading?: boolean
}

interface FormState {
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

const initialFormData: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
}

export function CreateAccountForm({
  onSuccess,
  isLoading = false,
}: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState<FormState>(initialFormData)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<
    Partial<Record<FieldName, boolean>>
  >({})

  const isFormValid = createAccountSchema.safeParse(formData).success

  function getValidationErrors(data: FormState): FormErrors {
    const result = createAccountSchema.safeParse(data)

    if (result.success) {
      return {}
    }

    return result.error.issues.reduce<FormErrors>((allErrors, issue) => {
      const field = issue.path[0] as FieldName | undefined

      if (field && !allErrors[field]) {
        allErrors[field] = issue.message
      }

      return allErrors
    }, {})
  }

  function updateField<TField extends keyof FormState>(
    field: TField,
    value: FormState[TField],
  ) {
    const nextData: FormState = {
      ...formData,
      [field]: value,
    }

    setFormData(nextData)

    if (touched[field]) {
      setErrors(getValidationErrors(nextData))
    }
  }

  function touchField(field: FieldName) {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }))

    setErrors(getValidationErrors(formData))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createAccountSchema.safeParse(formData)

    if (!result.success) {
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
        termsAccepted: true,
      })

      setErrors(getValidationErrors(formData))
      return
    }

    setErrors({})
    await onSuccess(result.data)
  }

  const fieldClassName =
    'h-12 rounded-2xl border-[#94b4dc23] bg-[#1c2e48] px-4 text-sm text-[#e2eaf4] shadow-none placeholder:text-[#4a5f78] focus-visible:border-[#0ea592] focus-visible:ring-2 focus-visible:ring-[#0ea592]/20'

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-[26px]">
      <div className="space-y-4">
        <FormField
          id="email"
          label="Email address"
          error={touched.email ? errors.email : undefined}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => touchField('email')}
            disabled={isLoading}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={
              touched.email && errors.email ? 'email-error' : undefined
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={touched.password ? errors.password : undefined}
        >
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={formData.password}
            visible={showPassword}
            onVisibleChange={() =>
              setShowPassword((currentValue) => !currentValue)
            }
            onChange={(event) => updateField('password', event.target.value)}
            onBlur={() => touchField('password')}
            disabled={isLoading}
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={
              touched.password && errors.password ? 'password-error' : undefined
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirm password"
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
        >
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            visible={showConfirmPassword}
            onVisibleChange={() =>
              setShowConfirmPassword((currentValue) => !currentValue)
            }
            onChange={(event) =>
              updateField('confirmPassword', event.target.value)
            }
            onBlur={() => touchField('confirmPassword')}
            disabled={isLoading}
            aria-invalid={Boolean(
              touched.confirmPassword && errors.confirmPassword,
            )}
            aria-describedby={
              touched.confirmPassword && errors.confirmPassword
                ? 'confirmPassword-error'
                : undefined
            }
            className={fieldClassName}
          />
        </FormField>
      </div>

      <div className="pt-[18px]">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(event) =>
              updateField('termsAccepted', event.currentTarget.checked)
            }
            onBlur={() => touchField('termsAccepted')}
            disabled={isLoading}
            aria-invalid={Boolean(
              touched.termsAccepted && errors.termsAccepted,
            )}
            aria-describedby={
              touched.termsAccepted && errors.termsAccepted
                ? 'termsAccepted-error'
                : undefined
            }
            className="mt-0.5 size-5 rounded-lg border-2 border-[#94b4dc2e] bg-transparent data-[state=checked]:border-[#0ea592] data-[state=checked]:bg-[#0ea592]"
          />

          <label
            htmlFor="termsAccepted"
            className="cursor-pointer text-sm leading-[22px] text-[#a8bdd4]"
          >
            I agree to the{' '}
            <a
              href="/terms"
              className="font-semibold text-[#0ea592] hover:underline"
            >
              GridX Terms
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="font-semibold text-[#0ea592] hover:underline"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {touched.termsAccepted && errors.termsAccepted ? (
          <p
            id="termsAccepted-error"
            role="alert"
            className="mt-1.5 text-xs text-[#fca5a5]"
          >
            {errors.termsAccepted}
          </p>
        ) : null}
      </div>

      <div className="pt-[18px]">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="h-12 w-full rounded-xl bg-[#0ea592] text-base font-semibold text-white hover:bg-[#0c9483] disabled:cursor-not-allowed disabled:bg-[#124b48] disabled:text-[#7a90a8]"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <p className="mt-3.5 text-center text-[11px] leading-4 text-[#4a5f78]">
          Complete all fields and accept the terms to continue.
        </p>
      </div>
    </form>
  )
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-[0.025em] text-[#a8bdd4]"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#fca5a5]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface PasswordInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'type'
> {
  visible: boolean
  onVisibleChange: () => void
}

function PasswordInput({
  visible,
  onVisibleChange,
  className,
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn(className, 'pr-12')}
        {...props}
      />

      <button
        type="button"
        onClick={onVisibleChange}
        disabled={props.disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-0 top-0 flex size-12 items-center justify-center text-[#4a5f78] transition hover:text-[#a8bdd4] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
