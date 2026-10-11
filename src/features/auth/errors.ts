import type { FormErrorOptions } from '#/lib/form-errors';

// API field names each auth form shows next to its inputs, so the form-level
export const LOGIN_ERROR_FIELDS = ['email', 'password'];
export const REGISTER_ERROR_FIELDS = ['name', 'email', 'password'];
export const VERIFY_EMAIL_ERROR_FIELDS = ['otp'];
export const FORGOT_PASSWORD_ERROR_FIELDS = ['email'];
export const RESET_PASSWORD_ERROR_FIELDS = ['newPassword'];
export const UPDATE_PROFILE_ERROR_FIELDS = ['name'];
export const EMAIL_CHANGE_ERROR_FIELDS = ['newEmail'];
export const CHANGE_PASSWORD_ERROR_FIELDS = ['currentPassword', 'newPassword'];

// In the auth API, a 409 Conflict on a form with an email field is about that
// email: already registered, already in use, or unchanged.
export const REGISTER_ERROR_OPTIONS: FormErrorOptions = {
  conflictField: 'email',
};
export const EMAIL_CHANGE_ERROR_OPTIONS: FormErrorOptions = {
  conflictField: 'newEmail',
};
