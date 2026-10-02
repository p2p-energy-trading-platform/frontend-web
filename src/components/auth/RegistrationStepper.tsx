import { Check } from 'lucide-react'

import { cn } from 'cn'

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
  const activeStep =
    steps.find((step) => step.id === currentStep) ?? steps.at(-1)
  const allComplete =
    steps.length > 0 && steps.every((step) => currentStep > step.id)

  return (
    <nav aria-label="Registration progress" className="w-full">
      <ol
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((step, index) => {
          const isComplete = currentStep > step.id
          const isActive = currentStep === step.id
          const status = isComplete
            ? 'completed'
            : isActive
              ? 'current step'
              : 'not started'

          return (
            <li
              key={step.id}
              className="relative flex min-w-0 flex-col items-center"
              aria-current={isActive ? 'step' : undefined}
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-4 left-[calc(50%+1.375rem)] h-px w-[calc(100%-2.75rem)] sm:top-5 sm:left-[calc(50%+1.5rem)] sm:w-[calc(100%-3rem)]',
                    isComplete ? 'bg-accent' : 'bg-border-default',
                  )}
                />
              ) : null}

              <span
                className={cn(
                  'relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-card text-sm font-semibold sm:size-9',
                  isComplete &&
                    'border-accent bg-accent text-accent-foreground',
                  isActive &&
                    'border-accent text-accent ring-4 ring-accent/15',
                  !isComplete &&
                    !isActive &&
                    'border-border-strong text-text-disabled',
                )}
              >
                {isComplete ? (
                  <Check
                    className="size-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                ) : (
                  <span aria-hidden="true">{step.id}</span>
                )}
              </span>

              <span className="sr-only">{status}.</span>
              <span className="mt-2 w-full min-w-0 px-2 text-center max-sm:sr-only sm:block">
                <span
                  className={cn(
                    'block text-sm font-semibold leading-4',
                    isComplete || isActive
                      ? 'text-foreground'
                      : 'text-text-disabled',
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    'mt-0.5 block text-caption leading-snug',
                    isActive ? 'text-text-tertiary' : 'text-text-disabled',
                  )}
                >
                  {step.description}
                </span>
              </span>
            </li>
          )
        })}
      </ol>

      {activeStep ? (
        <p className="mt-2 text-center sm:hidden" aria-hidden="true">
          <span className="block text-sm font-semibold leading-4 text-foreground">
            {allComplete ? 'All steps complete' : activeStep.label}
          </span>
          <span className="mt-0.5 block text-caption leading-snug text-text-tertiary">
            {allComplete ? activeStep.label : activeStep.description}
          </span>
        </p>
      ) : null}
    </nav>
  )
}
