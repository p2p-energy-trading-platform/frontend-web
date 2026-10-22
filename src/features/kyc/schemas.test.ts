import { describe, expect, it } from 'vitest';

import { kycSchema } from './schemas';

function file(type: string, size: number, name = 'id.jpg'): File {
  return new File([new Uint8Array(size)], name, { type });
}

const validValues = {
  fullName: 'Jane Doe',
  nicNumber: '199810212345',
  dateOfBirth: '1998-04-12',
  document: file('image/jpeg', 2048),
};

function errorsFor(values: Record<string, unknown>) {
  const result = kycSchema.safeParse(values);

  return result.success
    ? []
    : result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
}

describe('kycSchema', () => {
  it('accepts valid KYC details with a JPEG, PNG or PDF document', () => {
    expect(errorsFor(validValues)).toEqual([]);
    expect(
      errorsFor({ ...validValues, document: file('image/png', 2048) }),
    ).toEqual([]);
    expect(
      errorsFor({ ...validValues, document: file('application/pdf', 2048) }),
    ).toEqual([]);
  });

  it.each([
    ['old-format NIC', '901234567V'],
    ['old-format NIC with lowercase suffix', '901234567x'],
  ])('accepts a valid %s', (_case, nicNumber) => {
    expect(errorsFor({ ...validValues, nicNumber })).toEqual([]);
  });

  it.each([
    ['a foreign ID format', '784-1998-1234567-1'],
    ['an invalid encoded day', '199000012345'],
    ['an invalid old-format suffix', '901234567Z'],
    ['an incomplete number', '12345'],
  ])('rejects %s', (_case, nicNumber) => {
    expect(errorsFor({ ...validValues, nicNumber })).toContainEqual({
      path: 'nicNumber',
      message: 'Enter a valid Sri Lankan NIC number',
    });
  });

  it('requires every field', () => {
    expect(
      errorsFor({
        fullName: ' ',
        nicNumber: '',
        dateOfBirth: '',
        document: null,
      }),
    ).toEqual([
      { path: 'fullName', message: 'Legal full name is required' },
      { path: 'nicNumber', message: 'NIC number is required' },
      { path: 'dateOfBirth', message: 'Date of birth is required' },
      { path: 'document', message: 'Upload a photo or scan of your ID' },
    ]);
  });

  it.each([
    ['an impossible date', '1998-02-30'],
    ['a future date', '2999-01-01'],
    ['a non-date', 'not-a-date'],
  ])('rejects %s of birth', (_case, dateOfBirth) => {
    expect(errorsFor({ ...validValues, dateOfBirth })).toEqual([
      {
        path: 'dateOfBirth',
        message: 'Enter a valid date of birth in the past',
      },
    ]);
  });

  it('rejects an unsupported document type', () => {
    expect(
      errorsFor({
        ...validValues,
        document: file('image/gif', 2048, 'id.gif'),
      }),
    ).toEqual([
      { path: 'document', message: 'Upload a JPEG, PNG or PDF file' },
    ]);
  });

  it.each([
    ['an empty file', 0],
    ['a file over 10 MB', 10 * 1024 * 1024 + 1],
  ])('rejects %s', (_case, size) => {
    expect(
      errorsFor({ ...validValues, document: file('image/jpeg', size) }),
    ).toEqual([
      { path: 'document', message: 'The file must be 10 MB or smaller' },
    ]);
  });

  it('rejects names and ID numbers that are too long', () => {
    expect(
      errorsFor({
        ...validValues,
        fullName: 'x'.repeat(256),
        nicNumber: 'x'.repeat(21),
      }),
    ).toEqual([
      {
        path: 'fullName',
        message: 'Legal full name must be 255 characters or fewer',
      },
      {
        path: 'nicNumber',
        message: 'Enter a valid Sri Lankan NIC number',
      },
    ]);
  });
});
