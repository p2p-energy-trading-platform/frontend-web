import * as React from 'react';
import { Check } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import type { KycStatus } from './types';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { FileDropzone } from '../ui/file-input';

interface KycStepProps {
  onComplete: (status: KycStatus) => Promise<void> | void;
}

export function KycStep({ onComplete }: KycStepProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onComplete('pending');
  }

  return (
    <>
      <h1 className="font-heading text-heading-1 font-bold leading-8">
        Identity Verification
      </h1>

      <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
        Verify your identity (Optional)
      </p>
      <form onSubmit={handleSubmit} className="my-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="legalName">Legal Full Name</FieldLabel>
            <Input
              id="legalName"
              autoComplete="name"
              placeholder="Name as shown on your ID"
              className="h-12 rounded-2xl px-4"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="identityNumber">
              National ID / Passport
            </FieldLabel>
            <Input
              id="identityNumber"
              autoComplete="off"
              placeholder="Enter document number"
              className="h-12 rounded-2xl px-4"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
            <Input
              id="dateOfBirth"
              type="date"
              autoComplete="bday"
              max={new Date().toISOString().slice(0, 10)}
              className="h-12 rounded-2xl px-4"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="identityUpload">Identity Photo</FieldLabel>
            <FileDropzone id="identityUpload" />
          </Field>
          <Field orientation={'horizontal'} className="justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 rounded-xl"
            >
              Skip for Now
            </Button>

            <Button type="submit" className="h-12 flex-1 rounded-xl">
              Submit KYC
              <Check className="size-4" />
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
