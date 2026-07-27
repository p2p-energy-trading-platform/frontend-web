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
          >
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  'flex size-[34px] shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold transition-colors',
                  isComplete &&
                    'border-[#0ea592] bg-[#0ea592] text-white',
                  isActive &&
                    'border-[#0ea592] bg-[#0ea592]/10 text-[#0ea592]',
                  !isComplete &&
                    !isActive &&
                    'border-[#4a5f78] text-[#4a5f78]',
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
                    ? 'text-[#e2eaf4]'
                    : 'text-[#4a5f78]',
                )}
              >
                {step.label}
              </span>

              <span
                className={cn(
                  'hidden text-[10px] leading-[14px] sm:block',
                  isActive ? 'text-[#7a90a8]' : 'text-[#4a5f78]',
                )}
              >
                {step.description}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'mt-[17px] h-px min-w-6 flex-1 bg-[#94b4dc1f] sm:min-w-10',
                  isComplete && 'bg-[#0ea592]/50',
                )}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}