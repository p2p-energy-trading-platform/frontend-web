import { z } from 'zod';

const email = z
  .string()
  .trim()
  .max(254, 'Email must be 254 characters or fewer')
  .email('Enter a valid email address');

const fullName = z
  .string()
  .trim()
  .min(1, 'Full name is required')
  .max(100, 'Full name must be 100 characters or fewer');

const password = z
  .string()
  .min(8, 'Password must be 8 to 128 characters')
  .max(128, 'Password must be 8 to 128 characters');

const registrationPassword = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(128, 'Password must be 128 characters or fewer')
  .regex(/[A-Za-z]/, 'Add at least one letter')
  .regex(/[0-9]/, 'Add at least one number');

export const createAccountSchema = z
  .object({
    email,
    password: registrationPassword,
    confirmPassword: z.string(),
    termsAccepted: z.boolean(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((value) => value.termsAccepted, {
    path: ['termsAccepted'],
    message: 'You must accept the terms to continue',
  });

export type CreateAccountValues = z.infer<typeof createAccountSchema>;

export const registerSchema = z
  .object({
    fullName,
    email,
    password,
    confirmPassword: z.string(),
    termsAccepted: z.boolean(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((value) => value.termsAccepted, {
    path: ['termsAccepted'],
    message: 'You must accept the terms to continue',
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(128),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, 'Enter the complete 6-digit verification code'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const updateProfileSchema = z.object({
  name: fullName,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export function createEmailChangeSchema(currentEmail: string) {
  return z.object({
    newEmail: email.refine(
      (value) => value.toLowerCase() !== currentEmail.toLowerCase(),
      'Enter an email address different from your current one',
    ),
  });
}

export type EmailChangeFormValues = z.infer<
  ReturnType<typeof createEmailChangeSchema>
>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required').max(128),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword !== value.currentPassword, {
    path: ['newPassword'],
    message: 'Choose a password different from your current password',
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
