import { test, expect } from './fixture';
import path from 'path';

test('file upload fails with invalid data', async ({ page, user }) => {
  const filePath = path.join(__dirname, 'cat-meme-test.png');

  await page.goto('http://localhost:4200/home');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Log In' }).click();

  await page.getByRole('link', { name: 'Upload Meme' }).click();
  await page.getByRole('button', { name: 'Publish meme' }).click();
  
  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Select an image (PNG, JPG or JPEG)')).toBeVisible();
  await expect(page.getByLabel('Missing data')).toBeVisible();
});