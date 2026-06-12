import { test, expect } from './fixture';

test('signup fails with already existing username', async ({ page, user }) => {
  await page.goto('http://localhost:4200/home');
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill('xjwshkwhxkjh');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByLabel('Oops! Could not create a new')).toBeVisible();
});