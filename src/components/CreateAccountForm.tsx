import * as React from 'react'
import { Link } from '@tanstack/react-router'
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

interface CreateAccountFormState {
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

const initialFormData: CreateAccountFormState = {
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
  const [formData, setFormData] = React.useState(initialFormData)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<
    Partial<Record<FieldName, boolean>>
  >({})

  const validationResult = createAccountSchema.safeParse(formData)
  const isFormValid = validationResult.success

  function getValidationErrors(data = formData) {
    const result = createAccountSchema.safeParse(data)
    if (result.success) return {}

    return result.error.issues.reduce<FormErrors>((accumulator, issue) => {
      const field = issue.path[0] as FieldName | undefined
      if (field && !accumulator[field]) accumulator[field] = issue.message
      return accumulator
    }, {})
  }

  function updateField<Field extends keyof typeof formData>(
    field: Field,
    value: (typeof formData)[Field],
  ) {
    const nextData = { ...formData, [field]: value }
    setFormData(nextData)

    if (touched[field]) {
      setErrors(getValidationErrors(nextData))
    }
  }

  function markFieldTouched(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors(getValidationErrors())
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
      setErrors(getValidationErrors())
      return
    }

    setErrors({})
    await onSuccess(result.data)
  }

  const fieldClassName =
    'h-12 rounded-2xl border-border-input bg-background-well px-4 text-sm text-text-primary shadow-none placeholder:text-text-disabled focus-visible:border-action-accent focus-visible:ring-2 focus-visible:ring-action-accent/20'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          onBlur={() => markFieldTouched('email')}
          disabled={isLoading}
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
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
          onVisibleChange={() => setShowPassword((current) => !current)}
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() => markFieldTouched('password')}
          disabled={isLoading}
          aria-invalid={Boolean(touched.password && errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
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
          onVisibleChange={() => setShowConfirmPassword((current) => !current)}
          onChange={(event) =>
            updateField('confirmPassword', event.target.value)
          }
          onBlur={() => markFieldTouched('confirmPassword')}
          disabled={isLoading}
          aria-invalid={Boolean(
            touched.confirmPassword && errors.confirmPassword,
          )}
          aria-describedby={
            errors.confirmPassword ? 'confirmPassword-error' : undefined
          }
          className={fieldClassName}
        />
      </FormField>

      <div className="pt-1">
        <div className="flex items-start gap-3">
          <Checkbox
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(event) =>
              updateField('termsAccepted', event.currentTarget.checked)
            }
            onBlur={() => markFieldTouched('termsAccepted')}
            disabled={isLoading}
            aria-invalid={Boolean(
              touched.termsAccepted && errors.termsAccepted,
            )}
            className="mt-0.5 size-5 rounded-lg border-border-input bg-transparent data-[state=checked]:bg-action-accent"
          />
          <label
            htmlFor="termsAccepted"
            className="cursor-pointer text-sm leading-6 text-text-secondary"
          >
            I agree to the{' '}
            <a
              href="/terms"
              className="font-medium text-action-accent hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              GridX Terms
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="font-medium text-action-accent hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              Privacy Policy
            </a>
          </label>
        </div>
        {touched.termsAccepted && errors.termsAccepted ? (
          <p
            id="termsAccepted-error"
            role="alert"
            className="mt-1.5 text-xs text-feedback-error-text"
          >
            {errors.termsAccepted}
          </p>
        ) : null}
      </div>

      <div className="pt-5">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="h-12 w-full rounded-xl bg-action-accent text-base font-semibold text-white hover:bg-action-accent/90 disabled:bg-action-accent/45 disabled:text-text-secondary"
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
      </div>

      <p className="pt-1 text-center text-sm text-text-tertiary">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-semibold text-action-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
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
        className="block text-xs font-semibold uppercase tracking-[0.03em] text-text-secondary"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-feedback-error-text"
        >
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
        aria-pressed={visible}
        className="absolute right-0 top-0 flex size-12 items-center justify-center rounded-r-2xl text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-action-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
