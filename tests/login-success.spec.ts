import { test, expect } from './fixture';

test("login succeeds with valid credentials", async ({ page, user }) => {
  await page.goto('http://localhost:4200/home');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByLabel(`Welcome back ${user.userName}!`)).toBeVisible();
  await expect(page.getByRole('button', { name: `${user.userName.charAt(0).toUpperCase()}` })).toBeVisible();
});