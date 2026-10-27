import { expect, test } from './fixtures';

test.describe('forgot password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(
      page.getByRole('heading', { name: 'Forgot password?' }),
    ).toBeVisible();
  });

  test('rejects an invalid email', async ({ page, api }) => {
    await page.getByLabel('Email address').fill('not-an-email');
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    expect(
      api.requests.some(
        (request) => request.path === '/api/v1/auth/password-reset',
      ),
    ).toBe(false);
  });

  test('confirms that a reset link was requested', async ({ page, api }) => {
    api.on('POST', '/api/v1/auth/password-reset', {
      body: { success: true },
    });

    await page.getByLabel('Email address').fill('aisha@example.com');
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(
      page.getByText(
        'If an account exists for that email, a password-reset link will be sent.',
      ),
    ).toBeVisible();
  });
});
