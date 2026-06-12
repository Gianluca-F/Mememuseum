import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const suffix = Math.floor(Math.random() * 100000);

  await page.goto('http://localhost:4200/home');
  await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill('Pippo');
  await page.getByRole('textbox', { name: 'Password' }).fill('Paperino');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByLabel('Oops! Could not create a new')).toBeVisible();
  await page.getByRole('textbox', { name: 'Your username' }).fill('Pippo' + suffix);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByLabel('Welcome Pippo' + suffix + '!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'P Pippo' + suffix })).toBeVisible();
});