# Sign-Up End-to-End Testing

## 1. Overview

This document describes the end-to-end (E2E) testing implemented for the GridX sign-up and onboarding process.

The tests are implemented using **Playwright** in:

`e2e/sign-up.spec.ts`

The objective is to verify the complete user onboarding journey, from account creation to smart meter registration.

## 2. Test Scope

The E2E tests cover the following stages:

1. Account creation
2. Email verification
3. KYC submission
4. Smart meter registration
5. Onboarding completion

## 3. Test Scenarios

### 3.1 Account Creation

- Verify that the sign-up form displays validation errors when submitted empty.
- Verify that an error is displayed when the password and confirmation password do not match.
- Verify that a user can successfully create an account.
- Verify that the application navigates to the email verification step after successful registration.
- Verify that the registration request contains the expected user information.
- Verify that an appropriate error is displayed when the email address is already registered.

### 3.2 Email Verification

- Enter a six-digit verification code.
- Submit the verification code.
- Verify that the application accepts the successful verification response.
- Verify that the user can proceed to the KYC step.

### 3.3 KYC Submission

- Enter the user's legal full name.
- Enter the Sri Lankan NIC number.
- Enter the date of birth.
- Upload an identity document.
- Mock the document upload URL response and storage upload.
- Submit the KYC information.
- Verify that the KYC submission request contains the expected information and document path.

### 3.4 Smart Meter Registration

- Verify that the Smart Meter step is displayed.
- Enter the smart meter ID.
- Submit the connection request.
- Verify that the registration API receives the expected meter ID.
- Verify that the application displays the registration completion state.

### 3.5 Onboarding Completion

- Verify that the onboarding completion message is displayed.
- Verify that the registration summary is visible.
- Verify that identity status and smart meter information are displayed.
- Verify that the pending registration status is shown.
- Verify that the View Profile link is available.

## 4. API Mocking

The E2E tests use the API fixture defined in `e2e/fixtures.ts` to mock API responses.

The following endpoints are mocked in the complete sign-up flow:

| HTTP Method | API Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Account creation |
| POST | `/api/v1/auth/verify-email` | Email verification |
| POST | `/api/v1/kyc/upload-url` | Generate document upload URL |
| POST | `/api/v1/kyc` | Submit KYC information |
| POST | `/api/v1/registration/claim` | Submit smart meter registration |

The identity document upload is also intercepted using Playwright's `page.route()` functionality.

**Note:** These tests use mocked API responses. They verify frontend behavior and API request construction; they do not independently verify the actual backend services, database persistence, email delivery, or external storage integration.

## 5. Running the E2E Tests

Navigate to the `frontend-web` project directory.

Run the complete sign-up E2E test file:

```bash
npx playwright test e2e/sign-up.spec.ts
```

Alternatively, run all E2E tests:

```bash
npm run test:e2e
```

To run the tests using the Playwright UI:

```bash
npm run test:e2e:ui
```

Playwright browser installation, if required:

```bash
npx playwright install
```

The frontend development server is started automatically only if it is configured in `playwright.config.ts`. Otherwise, start it separately using:

```bash
npm run dev
```

## 6. Quality Checks

The following commands can be used to verify code quality and application correctness:

| Command | Purpose |
|---|---|
| `npm run lint` | Check ESLint issues |
| `npm run typecheck` | Check application and E2E TypeScript |
| `npm run check` | Check Prettier formatting |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run build` | Build the frontend application |

## 7. Expected Result

The complete sign-up E2E flow should successfully verify the following sequence:

Account Creation → Email Verification → KYC Submission → Smart Meter Registration → Onboarding Complete

All assertions should pass, confirming that the frontend handles the complete mocked onboarding journey as expected.

## 8. Related Issue

[PETPG-321 – Improve the existing sign up E2E testing flow](https://vidurshan145.atlassian.net/browse/PETPG-321)