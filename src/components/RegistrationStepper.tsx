import { Check } from 'lucide-react'

import { cn } from '#/lib/utils'

interface RegistrationStep {
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
    <div className="flex h-20 w-full items-start">
      {steps.map((step, index) => {
        const complete = currentStep > step.id
        const active = currentStep === step.id

        return (
          <div key={step.id} className="flex flex-1 items-start">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  'flex size-[34px] items-center justify-center rounded-full border text-[13px] font-semibold',
                  complete || active
                    ? 'border-[#0ea592] text-[#0ea592]'
                    : 'border-[#4a5f78] text-[#4a5f78]',
                )}
              >
                {complete ? <Check className="size-4" /> : step.id}
              </span>
              <span
                className={cn(
                  'text-[13px] font-semibold leading-[18px]',
                  complete || active ? 'text-[#e2eaf4]' : 'text-[#4a5f78]',
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  'text-[10px] leading-[14px]',
                  active ? 'text-[#7a90a8]' : 'text-[#4a5f78]',
                )}
              >
                {step.description}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className="mt-[17px] h-px w-[clamp(40px,16vw,225px)] shrink-0 bg-[#94b4dc1f]" />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}