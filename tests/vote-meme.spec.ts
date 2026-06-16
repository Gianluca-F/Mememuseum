import { test, expect } from './fixture';

test("upvotes and downvotes work correctly", async ({ page, user }) => {
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('http://localhost:4200/home');

  await page.goto('/meme-of-the-day');

  const upvoteButton = page.getByRole('article').getByRole('button').first();
  const downvoteButton = page.getByRole('article').getByRole('button').last();
  const upvotesBefore = Number(await upvoteButton.innerText());
  const downvotesBefore = Number(await downvoteButton.innerText());

  await upvoteButton.click();
  await expect(upvoteButton).toHaveText(String(upvotesBefore + 1));

  await downvoteButton.click();
  await expect(upvoteButton).toHaveText(String(upvotesBefore));
  await expect(downvoteButton).toHaveText(String(downvotesBefore + 1));

  await downvoteButton.click();
  await expect(downvoteButton).toHaveText(String(downvotesBefore));
});