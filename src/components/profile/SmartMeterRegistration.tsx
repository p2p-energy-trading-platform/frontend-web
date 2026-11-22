import { useEffect, useState } from 'react';
import { Loader, RadioTower, RefreshCw } from 'lucide-react';

import { SmartMeterStep } from '#/components/auth/SmartMeterStep';
import { Alert, AlertDescription } from '#/components/ui/alert';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { useAuthUser } from '#/features/auth/hooks';
import { useSelectedHouse } from '#/features/iot/hooks';
import { useReverifyRegistration } from '#/features/registration/hooks';
import {
  readMeterRegistration,
  saveMeterRegistration,
} from '#/features/registration/storage';
import type { MeterRegistrationRecord } from '#/features/registration/storage';

function registrationLabel(status: string) {
  switch (status.trim().toUpperCase()) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'EXPIRED':
      return 'Timed out';
    default:
      return 'Awaiting DEWA approval';
  }
}

function canReverify(status: string) {
  return status.trim().toUpperCase() !== 'APPROVED';
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to save the registration details. Please try again.';
}

export default function SmartMeterRegistration() {
  const { data: user } = useAuthUser();
  const selected = useSelectedHouse();
  const reverifyMutation = useReverifyRegistration();
  const [registration, setRegistration] =
    useState<MeterRegistrationRecord | null>(null);
  const [storageError, setStorageError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    setRegistration(null);
    try {
      setRegistration(readMeterRegistration(user.userId));
      setStorageError('');
    } catch (error) {
      setStorageError(errorMessage(error));
    }
  }, [user?.userId]);

  function rememberRegistration(next: MeterRegistrationRecord) {
    setRegistration(next);
    if (!user?.userId) {
      setStorageError(
        'The signed-in user could not be identified. Reverification may not be available after you leave this page.',
      );
      return;
    }
    try {
      saveMeterRegistration(user.userId, next);
      setStorageError('');
    } catch (error) {
      setStorageError(
        `${errorMessage(error)} Reverification may not be available after you leave this page.`,
      );
    }
  }

  async function handleReverify() {
    if (!registration) return;
    try {
      const response = await reverifyMutation.mutateAsync({
        registration_id: registration.registrationId,
        meter_id: registration.meterId,
      });
      rememberRegistration({
        registrationId: response.registration_id,
        meterId: response.meter_id,
        status: response.status,
      });
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <RadioTower className="size-4 text-brand-primary" />
          Smart meter registration
        </CardTitle>
        <CardDescription>
          Connect your utility meter or check a pending DEWA approval request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selected.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-text-tertiary">
            <Loader className="size-4 animate-spin" />
            Checking your smart meter...
          </p>
        ) : selected.house ? (
          <div>
            <p className="text-sm font-medium">Smart meter linked</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Meter {selected.house.meterId} is connected to your account.
            </p>
          </div>
        ) : isEditing ? (
          <div>
            <SmartMeterStep
              allowSkip={false}
              onComplete={async (_status, created) => {
                if (!created) return;
                rememberRegistration(created);
                setIsEditing(false);
              }}
            />
            <Button
              className="mt-2"
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        ) : registration ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                Meter {registration.meterId}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                Registration status: {registrationLabel(registration.status)}
              </p>
            </div>
            {canReverify(registration.status) ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleReverify()}
                disabled={reverifyMutation.isPending}
              >
                {reverifyMutation.isPending ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Recheck DEWA status
              </Button>
            ) : (
              <Badge>Approved</Badge>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-text-secondary">
              You skipped meter setup during registration. You can connect it
              now from your profile.
            </p>
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={Boolean(selected.error)}
            >
              Register a smart meter
            </Button>
          </div>
        )}

        {selected.error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Your linked meter status could not be loaded. Please try again
              before registering another meter.
            </AlertDescription>
          </Alert>
        ) : null}
        {storageError ? (
          <Alert variant="destructive">
            <AlertDescription>{storageError}</AlertDescription>
          </Alert>
        ) : null}
        {reverifyMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {errorMessage(reverifyMutation.error)}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
