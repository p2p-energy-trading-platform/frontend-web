import { expect, test } from './fixtures';

test.describe('marketing pages', () => {
  test('home page shows the hero', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Turn Your Energy into Shared Value',
      }),
    ).toBeVisible();
  });

  test('about page explains GridX', async ({ page }) => {
    await page.goto('/about');

    await expect(
      page.getByText('Peer-to-peer energy trading for households.'),
    ).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Terms of Service' }),
    ).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Privacy Policy' }),
    ).toBeVisible();
  });
});
