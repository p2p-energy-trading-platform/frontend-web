import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { RegistrationStepper } from '#/components/RegistrationStepper'
import { CreateAccountForm } from '#/components/CreateAccountForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

const REGISTRATION_STEPS = [
  {
    id: 1,
    label: 'Account',
    description: 'Create your account',
  },
  {
    id: 2,
    label: 'KYC',
    description: 'Verify your identity',
  },
  {
    id: 3,
    label: 'Smart Meter',
    description: 'Add your device',
  },
]

function SignUpPage() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState('')

  const handleCreateAccount = async (data: {
    email: string
    password: string
    confirmPassword: string
    termsAccepted: boolean
  }) => {
    setIsLoading(true)
    try {
      // TODO: Call your API endpoint here
      console.log('Creating account with:', { email: data.email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // On success, store email and move to next step
      setUserEmail(data.email)
      setCurrentStep(2)
    } catch (error) {
      console.error('Failed to create account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Join GridX Today
          </h1>
          <p className="text-muted-foreground">
            Create your account to start trading energy
          </p>
        </div>

        {/* Stepper */}
        <div className="px-4">
          <RegistrationStepper
            steps={REGISTRATION_STEPS}
            currentStep={currentStep}
          />
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Step {currentStep} of {REGISTRATION_STEPS.length}:{' '}
              {currentStep === 1 && 'Account Creation'}
              {currentStep === 2 && 'Email Verification'}
              {currentStep === 3 && 'Smart Meter Registration'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <CreateAccountForm
                onSuccess={handleCreateAccount}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Email Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification link to <strong>{userEmail}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Check your email inbox and click the verification link to
                    continue.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center text-sm">
                  <p className="text-muted-foreground">
                    🔒 Email verification coming soon
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handlePreviousStep} className="w-full">
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="w-full">
                    Skip (Demo)
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">
                    Smart Meter Registration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your smart meter device to start trading energy.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center text-sm">
                  <p className="text-muted-foreground">
                    📊 Smart meter registration coming soon
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handlePreviousStep} className="w-full">
                    Back
                  </Button>
                  <Button className="w-full" onClick={() => {
                    alert('Account creation flow complete! ✨')
                  }}>
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
