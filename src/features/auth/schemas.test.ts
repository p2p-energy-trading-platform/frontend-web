import { describe, expect, it } from 'vitest';

import { forgotPasswordSchema, resetPasswordSchema } from './schemas';

describe('forgotPasswordSchema', () => {
  it('accepts a valid email address', () => {
    expect(
      forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success,
    ).toBe(true);
  });

  it('rejects an invalid email address', () => {
    expect(
      forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success,
    ).toBe(false);
  });

  it('trims whitespace around the email address', () => {
    const result = forgotPasswordSchema.safeParse({
      email: '  user@example.com  ',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching passwords between 8 and 128 characters', () => {
    expect(
      resetPasswordSchema.safeParse({
        password: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      }).success,
    ).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(
      resetPasswordSchema.safeParse({
        password: 'short7',
        confirmPassword: 'short7',
      }).success,
    ).toBe(false);
  });

  it('rejects passwords longer than 128 characters', () => {
    const password = 'a'.repeat(129);

    expect(
      resetPasswordSchema.safeParse({
        password,
        confirmPassword: password,
      }).success,
    ).toBe(false);
  });

  it('rejects mismatched confirmation passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewPassword123!',
      confirmPassword: 'DifferentPassword123!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          issue.path.includes('confirmPassword'),
        ),
      ).toBe(true);
    }
  });
});
