import { test, expect } from './fixture';

test("comment can be written and then deleted if user is logged in", async ({ page, user }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('http://localhost:4200/home');

  await page.goto('/meme-of-the-day');
  await page.getByRole('textbox', { name: 'Write a comment' }).fill('Random comment');
  await page.getByRole('button', { name: 'Post' }).click();
  await expect(page.getByLabel('Done!')).toBeVisible();
  await expect(page.getByRole('alert', { name: 'Your comment has been posted' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete comment' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete comment' }).click();
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('alert', { name: 'The comment has been deleted' })).toBeVisible();
});