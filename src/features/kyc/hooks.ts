import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { authUserQueryOptions } from '#/features/auth/hooks';
import {
  createKycUploadUrl,
  getKycSubmission,
  submitKyc,
  uploadKycDocument,
} from './api';

export const kycSubmissionQueryOptions = queryOptions({
  queryKey: ['kyc', 'submission'] as const,
  queryFn: getKycSubmission,
  retry: false,
});

export function useKycSubmission() {
  return useQuery(kycSubmissionQueryOptions);
}

export interface SubmitKycInput {
  fullName: string;
  dateOfBirth: string;
  nicNumber: string;
  document: File;
  documentPath?: string;
}

export function useSubmitKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      document,
      documentPath,
      ...details
    }: SubmitKycInput) => {
      let storedDocumentPath = documentPath;

      if (!storedDocumentPath) {
        const { uploadUrl, objectKey } = await createKycUploadUrl(
          document.type,
          document.size,
        );

        await uploadKycDocument(uploadUrl, document);
        storedDocumentPath = objectKey;
      }

      return submitKyc({
        ...details,
        documentPath: storedDocumentPath,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: kycSubmissionQueryOptions.queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: authUserQueryOptions.queryKey,
      });
    },
  });
}
