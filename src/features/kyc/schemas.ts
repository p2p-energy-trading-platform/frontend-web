import { z } from 'zod';

export const KYC_DOCUMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];
export const KYC_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

function isValidSriLankanNicNumber(value: string): boolean {
  const nic = value.trim().toUpperCase();

  let year: number;
  let dayOfYear: number;

  if (/^\d{12}$/.test(nic)) {
    year = Number(nic.slice(0, 4));
    dayOfYear = Number(nic.slice(4, 7));
  } else if (/^\d{9}[VX]$/.test(nic)) {
    year = 1900 + Number(nic.slice(0, 2));
    dayOfYear = Number(nic.slice(2, 5));
  } else {
    return false;
  }

  if (dayOfYear > 500) dayOfYear -= 500;

  const daysInYear =
    new Date(Date.UTC(year, 1, 29)).getUTCDate() === 29 ? 366 : 365;

  return (
    year >= 1900 &&
    year <= new Date().getUTCFullYear() &&
    dayOfYear >= 1 &&
    dayOfYear <= daysInYear
  );
}

function isPastDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date.getTime() < Date.now()
  );
}

export const kycSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Legal full name is required')
    .max(255, 'Legal full name must be 255 characters or fewer'),
  nicNumber: z
    .string()
    .trim()
    .min(1, 'NIC number is required')
    .max(12, 'Enter a valid Sri Lankan NIC number')
    .refine(
      (value) =>
        value === '' || value.length > 12 || isValidSriLankanNicNumber(value),
      'Enter a valid Sri Lankan NIC number',
    ),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      // Empty values already get the "required" message above.
      (value) => value === '' || isPastDate(value),
      'Enter a valid date of birth in the past',
    ),
  document: z
    .instanceof(File, { message: 'Upload a photo or scan of your ID' })
    .nullable()
    .superRefine((file, context) => {
      if (!file) {
        context.addIssue({
          code: 'custom',
          message: 'Upload a photo or scan of your ID',
        });
      } else if (!KYC_DOCUMENT_TYPES.includes(file.type)) {
        context.addIssue({
          code: 'custom',
          message: 'Upload a JPEG, PNG or PDF file',
        });
      } else if (file.size === 0 || file.size > KYC_DOCUMENT_MAX_BYTES) {
        context.addIssue({
          code: 'custom',
          message: 'The file must be 10 MB or smaller',
        });
      }
    }),
});

export type KycFormValues = z.input<typeof kycSchema>;
