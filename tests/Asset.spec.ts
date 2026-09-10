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
async function loginAndNavigate(page: any) {
  await fillLogin(page, 'northdev@mailinator.com', 'password');
  await page.waitForURL('**/company/northdev/dashboard', { timeout: 15000 });
}
// General Test Case
test('TC-01 | Valid login — should redirect to dashboard', async ({ page }) => {
  await loginAndNavigate(page);
  await expect(page).toHaveURL(
    'https://isp-saas-staging.vercel.app/company/northdev/dashboard'
  );
  console.log('✅ TC-01 Passed — Redirected to dashboard successfully');
  const companyName = page.locator('span.font-bold.text-lg.text-gray-800');
  await expect(companyName).toHaveText('Northdev');
});
test('TC-02 | Asset Creation ', async ({ page }) => {
  await loginAndNavigate(page);
  await page.locator('a[href="/company/northdev/employees"]').click();
  await page.waitForURL('**/company/northdev/employees', { timeout: 10000 });
  await page.locator('a[href="/company/northdev/asset-manager"]').click();
  await expect(page).toHaveURL(
  'https://isp-saas-staging.vercel.app/company/northdev/asset-manager',
  { timeout: 10000 }
);
    const addAssetButton = page.locator('button', { hasText: 'Add Asset' });
await addAssetButton.waitFor({ state: 'visible', timeout: 5000 });
await addAssetButton.click();
const categoryDropdown = page.locator('button[role="combobox"]', { hasText: 'Select a category' });
await categoryDropdown.waitFor({ state: 'visible', timeout: 5000 });
await categoryDropdown.click();
await page.waitForTimeout(1000);
const accessoriesOption = page.locator('button', { hasText: 'Accessories' });
await accessoriesOption.waitFor({ state: 'visible', timeout: 5000 });
await accessoriesOption.click();
await page.getByPlaceholder('Enter equipment name').fill('Laptop');
await page.getByPlaceholder('Enter serial number').fill('E-101');
  const ownershipDropdown = page
    .locator('button[role="combobox"]')
    .filter({ hasText: 'Owned' });
  await page.locator('select').selectOption({ value: 'Rented' });
  // Select Due Date for the Asset
  await page.locator('#dateAdded').fill('2026-06-30');  
  // Select the Model for the Asset
  await page.getByPlaceholder('Enter model information').fill('New-2026');
  // Select the Asset Location
  const locationdropdown = page.locator('button[role="combobox"]', { hasText: 'Select a location' });
  await locationdropdown.click();
  const optionforlocation = page.locator('button span:text-is("Lahore")');
  await optionforlocation.click();
  // Save the Asset
  await page.locator('button:has-text("Save Asset")').click();

});
