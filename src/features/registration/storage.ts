export interface MeterRegistrationRecord {
  registrationId: string;
  meterId: string;
  status: string;
}

function storageKey(userId: string) {
  return `gridx.smartMeterRegistration.${userId}`;
}

export function readMeterRegistration(
  userId: string,
): MeterRegistrationRecord | null {
  const stored = window.localStorage.getItem(storageKey(userId));
  if (!stored) return null;

  const value: unknown = JSON.parse(stored);
  if (
    typeof value !== 'object' ||
    value === null ||
    !('registrationId' in value) ||
    typeof value.registrationId !== 'string' ||
    !('meterId' in value) ||
    typeof value.meterId !== 'string' ||
    !('status' in value) ||
    typeof value.status !== 'string'
  ) {
    throw new Error('Saved smart meter registration details are invalid.');
  }

  return {
    registrationId: value.registrationId,
    meterId: value.meterId,
    status: value.status,
  };
}

export function saveMeterRegistration(
  userId: string,
  registration: MeterRegistrationRecord,
) {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(registration));
}
