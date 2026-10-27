import { expect, test } from './fixtures';

test.describe('protected routes when signed out', () => {
  for (const path of ['/dashboard', '/trade', '/history/orders', '/wallet']) {
    test(`${path} redirects to sign in`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL('/sign-in');
      await expect(
        page.getByRole('heading', { name: 'Welcome back' }),
      ).toBeVisible();
    });
  }
});

test.describe('signed in', () => {
  test.beforeEach(({ api }) => {
    api.signIn();
  });

  test('dashboard loads', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(
      page.getByRole('heading', { level: 1, name: /Good evening/ }),
    ).toBeVisible();
  });

  test('trade page loads', async ({ page }) => {
    await page.goto('/trade');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Trading Terminal' }),
    ).toBeVisible();
  });

  test('history opens the orders tab', async ({ page }) => {
    await page.goto('/history');

    await expect(page).toHaveURL('/history/orders');
    await expect(
      page.getByRole('heading', { level: 1, name: 'History' }),
    ).toBeVisible();
  });

  test('sign-in page redirects to the dashboard', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveURL('/dashboard');
  });
});
