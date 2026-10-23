export const KYC_DOCUMENT_ERROR_FIELDS = [
  'documentPath',
  'contentType',
  'sizeBytes',
];

export const KYC_ERROR_FIELDS = [
  'fullName',
  'dateOfBirth',
  'nicNumber',
  ...KYC_DOCUMENT_ERROR_FIELDS,
];
