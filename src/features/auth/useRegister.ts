import { useMutation } from '@tanstack/react-query';

import { register } from './api';

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
  });
}
