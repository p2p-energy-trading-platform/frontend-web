import * as React from 'react';
import { Check, RadioTower, ShieldCheck } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import type { SmartMeterStatus } from './types';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import { Card, CardDescription } from '../ui/card';
import { useInitiateMeterClaim } from '#/features/registration/hooks';
import { smartMeterClaimSchema } from '#/features/registration/schemas';

interface SmartMeterStepProps {
  onComplete: (status: SmartMeterStatus) => Promise<void> | void;
}

export function SmartMeterStep({ onComplete }: SmartMeterStepProps) {
  const [meterId, setMeterId] = React.useState('');
  const [error, setError] = React.useState('');
  const initiateMeterClaimMutation = useInitiateMeterClaim();

  async function complete(status: SmartMeterStatus) {
    await onComplete(status);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = smartMeterClaimSchema.safeParse({ meterId });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please enter a valid Smart Meter ID');
      return;
    }

    setError('');
    try {
      await initiateMeterClaimMutation.mutateAsync({
        meter_id: result.data.meterId,
      });
      await onComplete('pending');
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : 'Unable to send the connection request. Please try again.',
      );
    }
  }

  return (
    <>
      <h1 className="font-heading text-heading-1 font-bold leading-8">
        Smart Meter
      </h1>

      <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
        Send a secure connection request to your utility, or skip this step and
        connect a meter later from your Profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-7" noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="smartMeterId">Smart Meter ID</FieldLabel>
            <Input
              id="smartMeterId"
              value={meterId}
              onChange={(event) => {
                setMeterId(event.target.value);
                setError('');
                initiateMeterClaimMutation.reset();
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'smartMeterError' : undefined}
              autoComplete="off"
              placeholder="MTR-7829-XY"
              className="h-12 rounded-2xl px-4"
            />
            <FieldDescription className="text-xs">
              Find this ID below the barcode on the front of your meter.
            </FieldDescription>

            {error ? (
              <p id="smartMeterError" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </Field>
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
