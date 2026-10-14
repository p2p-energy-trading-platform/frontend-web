import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authUserQueryOptions } from '#/features/auth/hooks';
import { createKycUploadUrl, submitKyc, uploadKycDocument } from './api';

export interface SubmitKycInput {
  fullName: string;
  dateOfBirth: string;
  dubaiId: string;
  document: File;
}

export function useSubmitKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ document, ...details }: SubmitKycInput) => {
      const { uploadUrl, objectKey } = await createKycUploadUrl(
        document.type,
        document.size,
      );

      await uploadKycDocument(uploadUrl, document);

      return submitKyc({ ...details, documentPath: objectKey });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authUserQueryOptions.queryKey,
      });
    },
  });
}
