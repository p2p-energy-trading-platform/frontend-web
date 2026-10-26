import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '#/components/ui/button';
import {
  DateField,
  FileUploadRow,
  SelectField,
} from '#/components/auth/SignupControls';
import { TextField } from '#/components/auth/AuthFields';
import { kycCountries } from '#/data/auth';
import type { KycStatus } from './types';

type DocumentKey = 'front' | 'back' | 'selfie';

function formatEmiratesId(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (!digits) return '';

  const groups = [
    digits.slice(0, 3),
    digits.slice(3, 7),
    digits.slice(7, 14),
    digits.slice(14, 15),
  ];
  return groups.filter(Boolean).join('-');
}

function isValidDate(day: string, month: string, year: string) {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return false;

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const date = new Date(yearNumber, monthNumber - 1, dayNumber);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return (
    date.getFullYear() === yearNumber &&
    date.getMonth() === monthNumber - 1 &&
    date.getDate() === dayNumber &&
    date <= today
  );
}

export function KycStep({
  onComplete,
}: {
  onComplete: (status: KycStatus) => Promise<void> | void;
}) {
  const [fullName, setFullName] = useState('');
  const [emiratesId, setEmiratesId] = useState('');
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const [nationality, setNationality] = useState('');
  const [documents, setDocuments] = useState<Record<DocumentKey, File | null>>({
    front: null,
    back: null,
    selfie: null,
  });

  const isValid =
    fullName.trim().length >= 2 &&
    /^784-\d{4}-\d{7}-\d$/.test(emiratesId) &&
    isValidDate(birthDate.day, birthDate.month, birthDate.year) &&
    Boolean(nationality) &&
    Boolean(documents.front && documents.back && documents.selfie);

  function updateDocument(key: DocumentKey, file: File | null) {
    setDocuments((current) => ({ ...current, [key]: file }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid) void onComplete('pending');
  }

  return (
    <form className="flex flex-1 flex-col" noValidate onSubmit={submit}>
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="font-heading text-[28px] leading-9 font-bold text-text-primary">
            Verify your identity
          </h1>
          <p className="mt-2 text-[15px] leading-[22px] text-text-secondary">
            Required by UAE regulations before you can trade or use the wallet.
            Takes about 2 minutes.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <TextField
            id="legal-name"
            label="Full legal name"
            autoComplete="name"
            placeholder="As shown on your Emirates ID"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-12 rounded-2xl"
          />

          <TextField
            id="emirates-id"
            label="Emirates ID number"
            autoComplete="off"
            inputMode="numeric"
            placeholder="784-YYYY-NNNNNNN-C"
            value={emiratesId}
            onChange={(event) =>
              setEmiratesId(formatEmiratesId(event.target.value))
            }
            className="h-12 rounded-2xl"
          />

          <div className="grid grid-cols-2 gap-3">
            <DateField
              id="date-of-birth"
              label="Date of birth"
              value={birthDate}
              onChange={setBirthDate}
            />
            <SelectField
              id="nationality"
              label="Nationality"
              value={nationality}
              onChange={setNationality}
              options={kycCountries.map((country) => ({
                label: country,
                value: country,
              }))}
            />
          </div>
        </div>

        <section
          aria-labelledby="kyc-documents-heading"
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="kyc-documents-heading"
              className="text-[13px] leading-[18px] font-semibold text-text-secondary"
            >
              Documents
            </h2>
            <p className="text-right text-xs leading-4 text-text-disabled">
              JPG, PNG or PDF · max 5 MB
            </p>
          </div>
          <FileUploadRow
            label="Emirates ID — front"
            hint="Name and ID number visible"
            file={documents.front}
            onFileChange={(file) => updateDocument('front', file)}
          />
          <FileUploadRow
            label="Emirates ID — back"
            hint="Barcode side visible"
            file={documents.back}
            onFileChange={(file) => updateDocument('back', file)}
          />
          <FileUploadRow
            label="Selfie holding your Emirates ID"
            hint="Face and ID both visible"
            file={documents.selfie}
            onFileChange={(file) => updateDocument('selfie', file)}
          />
        </section>

        <Button
          type="submit"
          disabled={!isValid}
          className="h-[52px] w-full rounded-xl text-base font-semibold"
        >
          Submit for verification
        </Button>
      </div>

      <div className="mt-auto pt-6 pb-2 text-center">
        <button
          type="button"
          onClick={() => void onComplete('not-submitted')}
          className="text-sm leading-5 font-medium text-text-secondary hover:text-text-primary"
        >
          Skip for now, verify later in Settings
        </button>
      </div>
    </form>
  );
}
