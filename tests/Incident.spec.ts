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
test('TC-01 | Incident Creation — navigate to Add Incident page', async ({ page }) => {
  await loginAndNavigate(page);
  await page.getByRole('link', { name: 'Incidents' }).filter({ visible: true }).click();
  await page.waitForURL(
    '**/company/northdev/incidents',
    { timeout: 10000 }
  );
  await page.getByRole('button', { name: 'New Incident' }).click();
  await expect(page).toHaveURL(
    'https://isp-saas-staging.vercel.app/company/northdev/incidents/new',
    { timeout: 10000 }
  );
});