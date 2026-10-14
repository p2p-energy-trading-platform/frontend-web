import { revalidateLogic, useForm } from '@tanstack/react-form';
import { Check, FileCheck2 } from 'lucide-react';

import { Button } from '#/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { FileDropzone } from '#/components/ui/file-input';
import { Input } from '#/components/ui/input';
import { toast } from '#/components/ui/toast';
import {
  KYC_DOCUMENT_ERROR_FIELDS,
  KYC_ERROR_FIELDS,
} from '#/features/kyc/errors';
import { useSubmitKyc } from '#/features/kyc/hooks';
import { kycSchema } from '#/features/kyc/schemas';
import type { KycFormValues } from '#/features/kyc/schemas';
import {
  formatFieldError,
  getApiFieldErrors,
  getGeneralFormError,
  getRequestIdError,
} from '#/lib/form-errors';
import type { KycStatus } from './types';

interface KycStepProps {
  onComplete: (status: KycStatus) => Promise<void> | void;
}

function formatFileSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KycStep({ onComplete }: KycStepProps) {
  const kycMutation = useSubmitKyc();

  const defaultValues: KycFormValues = {
    fullName: '',
    dubaiId: '',
    dateOfBirth: '',
    document: null,
  };

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: kycSchema },
    onSubmit: async ({ value }) => {
      // The schema guarantees a document; this narrows the type.
      if (!value.document) return;

      await kycMutation.mutateAsync({
        fullName: value.fullName.trim(),
        dubaiId: value.dubaiId.trim(),
        dateOfBirth: value.dateOfBirth,
        document: value.document,
      });

      toast.add({
        title: 'KYC submitted. We will review your documents shortly.',
        type: 'success',
      });
      await onComplete('pending');
    },
  });

  const documentApiErrors = KYC_DOCUMENT_ERROR_FIELDS.flatMap((field) =>
    getApiFieldErrors(kycMutation.error, field),
  );

  return (
    <>
      <h1 className="font-heading text-heading-1 font-bold leading-8">
        Identity Verification
      </h1>

      <p className="mt-1 flex gap-1 text-sm leading-5 text-text-tertiary">
        Verify your identity (Optional)
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        noValidate
        className="my-6"
      >
        <FieldGroup>
          <form.Field name="fullName">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Legal Full Name</FieldLabel>
                <Input
                  id={field.name}
                  autoComplete="name"
                  placeholder="Name as shown on your ID"
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    kycMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(kycMutation.error, 'fullName').length > 0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(kycMutation.error, 'fullName'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="dubaiId">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Dubai ID Number</FieldLabel>
                <Input
                  id={field.name}
                  autoComplete="off"
                  placeholder="Enter your ID number"
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    kycMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(kycMutation.error, 'dubaiId').length > 0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(kycMutation.error, 'dubaiId'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="dateOfBirth">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Date of birth</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  autoComplete="bday"
                  max={new Date().toISOString().slice(0, 10)}
                  className="h-12 rounded-2xl px-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    kycMutation.reset();
                    field.handleChange(event.target.value);
                  }}
                  aria-invalid={
                    field.state.meta.errors.length > 0 ||
                    getApiFieldErrors(kycMutation.error, 'dateOfBirth').length >
                      0
                  }
                />
                <FieldError
                  errors={[
                    ...field.state.meta.errors.map(formatFieldError),
                    ...getApiFieldErrors(kycMutation.error, 'dateOfBirth'),
                  ]}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="document">
            {(field) => {
              const file = field.state.value;

              return (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Identity Photo</FieldLabel>
                  <FileDropzone
                    id={field.name}
                    onFileSelect={(selected) => {
                      kycMutation.reset();
                      field.handleChange(selected);
                      field.handleBlur();
                    }}
                    icon={
                      file ? (
                        <FileCheck2 className="size-6 text-accent" />
                      ) : undefined
                    }
                    title={file ? file.name : undefined}
                    description={
                      file
                        ? `${formatFileSize(file.size)} · Click to choose a different file`
                        : undefined
                    }
                    aria-invalid={
                      field.state.meta.errors.length > 0 ||
                      documentApiErrors.length > 0
                    }
                  />
                  <FieldError
                    errors={[
                      ...field.state.meta.errors.map(formatFieldError),
                      ...documentApiErrors,
                    ]}
                  />
                </Field>
              );
            }}
          </form.Field>
          {getGeneralFormError(kycMutation.error, KYC_ERROR_FIELDS) ? (
            <FieldError>
              {getGeneralFormError(kycMutation.error, KYC_ERROR_FIELDS)}
            </FieldError>
          ) : null}
          {getRequestIdError(kycMutation.error) ? (
            <p className="text-xs text-text-disabled">
              {getRequestIdError(kycMutation.error)}
            </p>
          ) : null}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Field orientation={'horizontal'} className="justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-xl"
                  disabled={isSubmitting}
                  onClick={() => void onComplete('not-submitted')}
                >
                  Skip for Now
                </Button>

                <Button
                  type="submit"
                  className="h-12 flex-1 rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit KYC'}
                  <Check className="size-4" />
                </Button>
              </Field>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </>
  );
}
