import {
  useMutation,
  useQuery,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';

import {
  fetchCurrentUser,
  fetchProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  verifyEmailChange,
  login,
  logout,
  register,
  resendOtp,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from './api';

export const authUserQueryOptions = queryOptions({
  queryKey: ['authUser'] as const,
  queryFn: fetchCurrentUser,
  retry: false,
});

export function useAuthUser() {
  return useQuery(authUserQueryOptions);
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => register(name, email, password),
    onSuccess: async () => {
      await queryClient.fetchQuery(authUserQueryOptions);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const result = await verifyEmail(email, otp);
      if (!result.success) {
        throw new Error(result.message || 'Email verification failed.');
      }
      return result;
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const result = await resendOtp(email);
      if (!result.success) {
        throw new Error('Could not resend the code. Please try again later.');
      }
      return result;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: async () => {
      await queryClient.fetchQuery(authUserQueryOptions);
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

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => requestPasswordReset(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
  });
}

export const userProfileQueryOptions = queryOptions({
  queryKey: ['userProfile'] as const,
  queryFn: fetchProfile,
  retry: false,
});

export function useUserProfile() {
  return useQuery(userProfileQueryOptions);
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name }: { name: string }) => updateProfile(name),
    onSuccess: async (profile) => {
      queryClient.setQueryData(userProfileQueryOptions.queryKey, profile);
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => changePassword(currentPassword, newPassword),
  });
}

export function useRequestEmailChange() {
  return useMutation({
    mutationFn: ({ newEmail }: { newEmail: string }) =>
      requestEmailChange(newEmail),
  });
}

export function useVerifyEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token }: { token: string }) => verifyEmailChange(token),
    onSuccess: async (profile) => {
      queryClient.setQueryData(userProfileQueryOptions.queryKey, profile);
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}
