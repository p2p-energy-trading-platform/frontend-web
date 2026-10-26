import { Zap } from 'lucide-react';
import { AuthBackButton } from '#/components/auth/AuthBackButton';

export function LogoMark() {
  return (
    <span
      aria-label="GridX"
      className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm"
    >
      <Zap className="size-4 fill-current" aria-hidden="true" />
    </span>
  );
}

export function AuthStepHeader({
  currentStep,
  onBack,
}: {
  currentStep: 1 | 2 | 3 | 4;
  onBack: () => void;
}) {
  return (
    <header className="w-full pt-2">
      <div className="flex h-10 items-center justify-between">
        <AuthBackButton onClick={onBack} />
        <p className="text-[13px] leading-[18px] font-medium text-text-secondary">
          Step {currentStep} of 4
        </p>
      </div>
      <ol
        aria-label={`Step ${currentStep} of 4`}
        className="mt-2 grid grid-cols-4 gap-1.5"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className={`h-1 rounded-full ${index < currentStep ? 'bg-accent' : 'bg-border-default'}`}
            aria-current={index + 1 === currentStep ? 'step' : undefined}
          />
        ))}
      </ol>
    </header>
  );
}

export const StepHeader = AuthStepHeader;
