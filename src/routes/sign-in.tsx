import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff, Zap, Globe } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Checkbox } from '#/components/ui/checkbox'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Signing in with:', { email, rememberMe })
    alert(`Welcome back, ${email}!`)
  }

  const isFormValid = email && password

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-foreground">GridX</span>
          <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded">
            Beta
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your GridX account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium block">
              EMAIL ADDRESS
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full"
            />
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
                value={password}
                onChange={e => setPassword(e.target.value)}
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
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.currentTarget.checked)}
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
            disabled={!isFormValid}
            className="w-full h-11 text-base font-medium"
          >
            Sign in
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
              className="w-full h-10 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              UAE PASS
            </Button>

            {/* Google & Microsoft Row */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 text-sm font-medium"
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 text-sm font-medium"
              >
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
      </div>
    </div>
  )
}
