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
test('TC-01 | Inspection Creation — navigate to Add Inspection page', async ({ page }) => {
  await loginAndNavigate(page);
  await page.getByRole('link', { name: 'Inspections' }).filter({ visible: true }).click();
  await page.waitForURL(
    '**/company/northdev/inspections',
    { timeout: 10000 }
  );
});