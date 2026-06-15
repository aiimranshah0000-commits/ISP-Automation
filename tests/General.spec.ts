import { test, expect } from '@playwright/test';

  async function fillLogin(page: any, email: string, password: string) {
    await page.goto('https://isp-saas-staging.vercel.app/');
    const emailInput = page.locator('#emailOrUsername');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(email);
    await page.locator('#password').fill(password);
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
  }

  async function getErrorMessage(page: any) {
    const error = page.locator('div.bg-red-50 p.text-red-600');
    await error.waitFor({ state: 'visible', timeout: 5000 });
    return await error.innerText();
  }

  // ── POSITIVE TEST ────────────────────────────────────

  test('TC-01 | Valid login — should redirect to dashboard', async ({ page }) => {
    await fillLogin(page, 'northdev@mailinator.com', 'password');
    await page.waitForURL('**/company/northdev/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(
      'https://isp-saas-staging.vercel.app/company/northdev/dashboard'
    );
    console.log('✅ TC-01 Passed — Redirected to dashboard successfully');
     const companyName = page.locator('span.font-bold.text-lg.text-gray-800');
     await expect(companyName).toHaveText('Northdevjjj');

     // Go to General Setting
      await page.getByRole('link', { name: /general settings/i }).click();
      await page.waitForURL('**/company/northdev/settings', { timeout: 10000 });
      // Verify the Same Email
      const emailInput = page.locator('input[type="email"]');
       await expect(emailInput).toHaveValue('northdev@mailinator.com');
    console.log('✅ TC-01 Passed — Redirected and company name verified');
  });