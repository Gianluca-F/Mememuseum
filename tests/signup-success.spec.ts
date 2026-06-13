import { test, expect } from '@playwright/test';

test('signup succeeds', async ({ page }) => {
  const username = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const firstLetter = username.charAt(0).toUpperCase();

  await page.goto('http://localhost:4200/home');
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill('Pluto9000');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText(`Welcome ${username}!`)).toBeVisible();
  await expect(page.getByRole('button', { name: `${firstLetter}` })).toBeVisible();
});