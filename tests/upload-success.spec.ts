import { test, expect } from './fixture';
import path from 'path';

test('file upload succeeds with valid file', async ({ page, user }) => {
  const filePath = path.join(__dirname, 'cat-meme-test.png');

  await page.goto('http://localhost:4200/home');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();

  const hamburgerMenuButton = page.getByRole('button', { name: 'Toggle mobile menu' });
  if (await hamburgerMenuButton.isVisible()) {
    await hamburgerMenuButton.click();
  }
  
  await page.getByRole('link', { name: 'Upload Meme' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Cat meme');
  await page.getByRole('textbox', { name: 'Description' }).fill('Cat meme for testing purposw');
  await page.getByRole('textbox', { name: 'Tags' }).fill('cat, meme, iconic10');
  await page.getByRole('button', { name: 'Image' }).setInputFiles(filePath);
  await page.getByRole('button', { name: 'Publish meme' }).click();

  await expect(page.getByLabel('Done!')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Cat meme' })).toBeVisible();
});