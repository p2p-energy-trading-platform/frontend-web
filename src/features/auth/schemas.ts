import { z } from 'zod';

const email = z
  .string()
  .trim()
  .max(254, 'Email must be 254 characters or fewer')
  .email('Enter a valid email address');

export const registerSchema = z
  .object({
    email,
    password: z
      .string()
      .min(8, 'Password must be 8 to 128 characters')
      .max(128, 'Password must be 8 to 128 characters'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean(),
  })
  .refine(
    (value) =>
      value.password === value.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    },
  )
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
