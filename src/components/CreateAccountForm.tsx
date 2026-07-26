import * as React from 'react'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Checkbox } from '#/components/ui/checkbox'

const createAccountSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    termsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type CreateAccountFormData = z.infer<typeof createAccountSchema>

type FormErrors = Partial<Record<keyof CreateAccountFormData, string>>

interface CreateAccountFormProps {
  onSuccess?: (data: CreateAccountFormData) => void
  isLoading?: boolean
}

export const CreateAccountForm = ({
  onSuccess,
  isLoading = false,
}: CreateAccountFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState<CreateAccountFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Partial<Record<keyof CreateAccountFormData, boolean>>>({})

  const validateField = (name: keyof CreateAccountFormData, value: unknown) => {
    try {
      const fieldSchema = z.object({
        [name]: createAccountSchema.shape[name],
      })
      fieldSchema.parse({ [name]: value })
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Invalid input'
      }
      return 'Invalid input'
    }
  }

  const handleFieldChange = (field: keyof CreateAccountFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }))
    }
  }

  const handleFieldBlur = (field: keyof CreateAccountFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }))

    const error = validateField(field, formData[field])
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    try {
      const validatedData = createAccountSchema.parse(formData)
      setErrors({})
      onSuccess?.(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.errors.forEach(err => {
          const path = err.path[0] as keyof CreateAccountFormData
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const isFormValid =
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.termsAccepted

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={e => handleFieldChange('email', e.target.value)}
          onBlur={() => handleFieldBlur('email')}
          disabled={isLoading}
          className="w-full"
        />
        {errors.email && touched.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={e => handleFieldChange('password', e.target.value)}
            onBlur={() => handleFieldBlur('password')}
            disabled={isLoading}
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && touched.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={e => handleFieldChange('confirmPassword', e.target.value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            disabled={isLoading}
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={formData.termsAccepted}
          onChange={e => handleFieldChange('termsAccepted', e.currentTarget.checked)}
          disabled={isLoading}
          className="mt-1"
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
        >
          I agree to the{' '}
          <a href="#" className="text-primary hover:underline font-medium">
            GridX Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline font-medium">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-xs text-destructive">{errors.termsAccepted}</p>
      )}

      {/* Create Account Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </form>
  )
}
