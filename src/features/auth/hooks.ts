import {
  useMutation,
  useQuery,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';

import { fetchCurrentUser, login, logout, register } from './api';

export const authUserQueryOptions = queryOptions({
  queryKey: ['authUser'] as const,
  queryFn: fetchCurrentUser,
  retry: false,
});

export function useAuthUser() {
  return useQuery(authUserQueryOptions);
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(['authUser'], {
        ...user,
        status: 'ACTIVE',
        role: 'USER',
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.clear();
      queryClient.setQueryData(['authUser'], null);
    },
  });
}
