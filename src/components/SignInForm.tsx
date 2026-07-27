import * as React from 'react'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Checkbox } from '#/components/ui/checkbox'

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

type SignInFormData = z.infer<typeof signInSchema>

type FormErrors = Partial<Record<keyof SignInFormData, string>>

interface SignInFormProps {
  onSuccess?: (data: SignInFormData) => void
  isLoading?: boolean
}

export const SignInForm = ({
  onSuccess,
  isLoading = false,
}: SignInFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<
    Partial<Record<keyof SignInFormData, boolean>>
  >({})

  const validateField = (name: keyof SignInFormData, value: unknown) => {
    try {
      const fieldSchema = z.object({
        [name]: signInSchema.shape[name],
      })
      fieldSchema.parse({ [name]: value })
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Invalid input'
      }
      return 'Invalid input'
    }
  }

  const handleFieldChange = (field: keyof SignInFormData, value: unknown) => {
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

  const handleFieldBlur = (field: keyof SignInFormData) => {
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

    try {
      const validatedData = signInSchema.parse(formData)
      setErrors({})
      onSuccess?.(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.issues.forEach((err: z.ZodIssue) => {
          const path = err.path[0] as keyof SignInFormData
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium block">
          EMAIL ADDRESS
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            PASSWORD
          </label>
          <a
            href="#"
            className="text-xs text-primary hover:underline font-medium"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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

      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="rememberMe"
          checked={formData.rememberMe}
          onChange={e =>
            handleFieldChange('rememberMe', e.currentTarget.checked)
          }
          disabled={isLoading}
        />
        <label
          htmlFor="rememberMe"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Remember me for 30 days
        </label>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full h-11 text-base font-medium"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      {/* Social Login Options */}
      <div className="space-y-3">
        {/* UAE PASS */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm font-medium"
          disabled={isLoading}
        >
          <span className="mr-2">🇦🇪</span>
          UAE PASS
        </Button>

        {/* Google & Microsoft Row */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 text-sm font-medium"
            disabled={isLoading}
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 text-sm font-medium"
            disabled={isLoading}
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.4 24H0V11.6h11.4V24zM24 24H12.6V11.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            Microsoft
          </Button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Create account
          </a>
        </p>
      </div>

      {/* Skip to Portal Link */}
      <div className="text-center pt-2">
        <a
          href="#"
          className="text-xs text-primary hover:underline font-medium uppercase tracking-wide"
        >
          Skip to portal →
        </a>
      </div>
    </form>
  )
}
