import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authUserQueryOptions } from '#/features/auth/hooks';
import { createKycUploadUrl, submitKyc, uploadKycDocument } from './api';

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
        queryKey: authUserQueryOptions.queryKey,
      });
    },
  });
}
