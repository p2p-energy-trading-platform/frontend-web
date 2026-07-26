import { cn } from '#/lib/utils'
import { Check } from 'lucide-react'

interface RegistrationStep {
  id: number
  label: string
  description: string
}

interface RegistrationStepperProps {
  steps: RegistrationStep[]
  currentStep: number
}

export const RegistrationStepper = ({
  steps,
  currentStep,
}: RegistrationStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  currentStep > step.id
                    ? 'border-primary bg-primary text-white'
                    : currentStep === step.id
                      ? 'border-primary bg-transparent text-primary'
                      : 'border-muted bg-muted text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    currentStep === step.id
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={cn(
                    'h-1 rounded-full transition-all',
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
