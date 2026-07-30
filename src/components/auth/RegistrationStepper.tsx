import { Check } from 'lucide-react'

import { cn } from '#/lib/utils'

export interface RegistrationStep {
  id: number
  label: string
  description: string
}

interface RegistrationStepperProps {
  steps: RegistrationStep[]
  currentStep: number
}

export function RegistrationStepper({
  steps,
  currentStep,
}: RegistrationStepperProps) {
  return (
    <ol
      className="flex h-20 w-full items-start"
      aria-label="Registration progress"
    >
      {steps.map((step, index) => {
        const isComplete = currentStep > step.id
        const isActive = currentStep === step.id

        return (
          <li
            key={step.id}
            className="flex min-w-0 flex-1 items-start"
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${step.label}: ${
              isComplete
                ? 'completed'
                : isActive
                  ? 'current step'
                  : 'not started'
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  'flex size-[34px] shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold transition-colors',
                  isComplete &&
                    'border-accent bg-accent text-accent-foreground',
                  isActive && 'border-accent bg-accent/10 text-accent',
                  !isComplete &&
                    !isActive &&
                    'border-border-strong text-text-disabled',
                )}
              >
                {isComplete ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  step.id
                )}
              </span>

              <span
                className={cn(
                  'truncate text-[13px] font-semibold leading-[18px]',
                  isComplete || isActive
                    ? 'text-foreground'
                    : 'text-text-disabled',
                )}
              >
                {step.label}
              </span>

              <span
                className={cn(
                  'hidden text-[10px] leading-[14px] sm:block',
                  isActive ? 'text-text-tertiary' : 'text-text-disabled',
                )}
              >
                {step.description}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'mt-[17px] h-px min-w-6 flex-1 bg-border-default sm:min-w-10',
                  isComplete && 'bg-accent/50',
                )}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
