import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  await page.goto('https://isp-saas-staging.vercel.app/');
  await page.getByRole('textbox', { name: 'Email or Username' }).click();
  await page.getByRole('textbox', { name: 'Email or Username' }).fill('northdev@mailinator.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Tasks' }).click();
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByRole('textbox', { name: 'Enter task title...' }).click();
  await page.getByRole('textbox', { name: 'Enter task title...' }).fill('Test Custom');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByText('Due date is required')).toHaveText('Due date is required');
  console.log("Due date is required");
  await expect(page.getByText('Assigned to is required')).toHaveText('Assigned to is required');
  console.log("Assignee user is required")
  await page.locator('input[type="date"]').fill('2026-08-25');
  await page.getByRole('button', { name: 'Create Task' }).click();
  await page.getByText('Assigned to is required').dblclick();
  await page.getByRole('combobox').filter({ hasText: 'Select employee...' }).click();
  await page.getByLabel('John Doe').getByText('John Doe').click();
  await page.getByRole('button', { name: 'Create Task' }).click();  
});
