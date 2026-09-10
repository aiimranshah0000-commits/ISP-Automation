import { test, expect } from '@playwright/test';
async function fillLogin(page: any, email: string, password: string) {
  await page.goto('https://isp-saas-staging.vercel.app/');
  const emailInput = page.locator('#emailOrUsername');
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}
async function loginAndNavigate(page: any) {
  await fillLogin(
    page,
    'northdev@mailinator.com',
    'password'
  );
  await page.waitForURL(
    '**/company/northdev/dashboard',
    { timeout: 15000 }
  );
}
test('TC-02 | Contractor Management — navigate to Add Contractor page', async ({ page }) => {
  await loginAndNavigate(page);

  await page
    .getByRole('link', { name: 'Contractor Management' })
    .filter({ visible: true })
    .click();
  await page.waitForURL(
    '**/company/northdev/contractor-management',
    { timeout: 10000 }
  );
  await page
    .getByRole('button', { name: 'New Contractor' })
    .click();
  await expect(page).toHaveURL(
    'https://isp-saas-staging.vercel.app/company/northdev/contractor-management/new',
    { timeout: 10000 }
  );
});
