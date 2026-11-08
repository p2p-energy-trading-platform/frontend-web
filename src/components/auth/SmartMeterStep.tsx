import { revalidateLogic, useForm } from '@tanstack/react-form';
import { Check, RadioTower, ShieldCheck } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Card, CardDescription } from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import { useInitiateMeterClaim } from '#/features/registration/hooks';
import { smartMeterClaimSchema } from '#/features/registration/schemas';
import type { SmartMeterClaimValues } from '#/features/registration/schemas';
import type { SmartMeterStatus } from './types';
import { formatFieldError } from '#/lib/form-errors';

interface SmartMeterStepProps {
  onComplete: (status: SmartMeterStatus) => Promise<void> | void;
}

export function SmartMeterStep({ onComplete }: SmartMeterStepProps) {
  const initiateMeterClaimMutation = useInitiateMeterClaim();

  async function complete(status: SmartMeterStatus) {
    await onComplete(status);
  }

  const form = useForm({
    defaultValues: { meterId: '' } satisfies SmartMeterClaimValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: smartMeterClaimSchema },
    onSubmit: async ({ value }) => {
      const { meterId } = smartMeterClaimSchema.parse(value);
      await initiateMeterClaimMutation.mutateAsync({
        meter_id: meterId,
      });
      await onComplete('pending');
    },
  });

  return (
    <>
      <h1 className="font-heading text-heading-1 font-bold leading-8">
        Smart Meter
      </h1>

      <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
        Send a secure connection request to your utility, or skip this step and
        connect a meter later from your Profile.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        className="mt-7"
        noValidate
      >
        <FieldGroup>
          <form.Field name="meterId">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Smart Meter ID</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    initiateMeterClaimMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={
                    field.state.meta.errors.length > 0
                      ? 'smartMeterError'
                      : undefined
                  }
                  autoComplete="off"
                  placeholder="MTR-7829-XY"
                  className="h-12 rounded-2xl px-4"
                />
                <FieldDescription className="text-xs">
                  Find this ID below the barcode on the front of your meter.
                </FieldDescription>
                <FieldError
                  id="smartMeterError"
                  errors={field.state.meta.errors.map(formatFieldError)}
                />
              </Field>
            )}
          </form.Field>
          {initiateMeterClaimMutation.error ? (
            <FieldError>
              {initiateMeterClaimMutation.error instanceof Error
                ? initiateMeterClaimMutation.error.message
                : 'Unable to send the connection request. Please try again.'}
            </FieldError>
          ) : null}
          <Card className="p-4">
            <CardDescription>
              <div className="flex gap-3">
                <RadioTower className="mt-0.5 size-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-semibold">
                    Secure approval request
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-tertiary">
                    GridX sends an approval request to your utility app. Meter
                    access remains read-only, and no device settings are
                    changed.
                  </p>
                </div>
              </div>
            </CardDescription>
          </Card>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => complete('skipped')}
              disabled={initiateMeterClaimMutation.isPending}
              className="h-12 flex-1 rounded-xl"
            >
              <ShieldCheck className="size-4" />
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={initiateMeterClaimMutation.isPending}
              className="h-12 flex-1 rounded-xl"
            >
              {initiateMeterClaimMutation.isPending
                ? 'Sending Request...'
                : 'Send Connection Request'}
              <Check className="size-4" />
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
