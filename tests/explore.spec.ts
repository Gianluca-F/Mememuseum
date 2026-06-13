import { test, expect } from './fixture';
import path from 'path';

test.describe('Explore with and without results', () => {
  test('explore finds an uploaded meme by title and tag', async ({ page, user }) => {
    const filePath = path.join(__dirname, 'cat-meme-test.png');
    const uniqueTitle = `Explorable cat ${Date.now()}`;
    const uniqueTag = `explore${Date.now()}`;

    await page.goto('http://localhost:4200/login');
    await page.getByRole('textbox', { name: 'Your username' }).fill(user.userName);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('http://localhost:4200/home');

    const hamburgerMenuButton = page.getByRole('button', { name: 'Toggle mobile menu' });
    if (await hamburgerMenuButton.isVisible()) {
      await hamburgerMenuButton.click();
    }

    await page.getByRole('link', { name: 'Upload Meme' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill(uniqueTitle);
    await page.getByRole('textbox', { name: 'Description' }).fill('Cat meme for explore testing');
    await page.getByRole('textbox', { name: 'Tags' }).fill(uniqueTag);
    await page.getByRole('button', { name: 'Image' }).setInputFiles(filePath);
    await page.getByRole('button', { name: 'Publish meme' }).click();
    await expect(page.getByLabel('Done!')).toBeVisible();

    await page.goto('http://localhost:4200/explore');
    await expect(page).toHaveTitle('Explore | Meme Museum');

    await page.getByRole('textbox', { name: 'Title' }).fill(uniqueTitle);
    await page.getByText('Search', { exact: true }).click();

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    await expect(page.getByText('No memes found for the given criteria.')).toBeHidden();

    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByRole('textbox', { name: 'Tags' }).fill(uniqueTag);
    await page.getByText('Search', { exact: true }).click();

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    await expect(page.getByText(`#${uniqueTag}`)).toBeVisible();
  });

  test('explore shows no results for an unmatched query', async ({ page }) => {
    await page.goto('http://localhost:4200/explore');

    await page.getByRole('textbox', { name: 'Title' }).fill(`nonexistent-${Date.now()}`);
    await page.getByText('Search', { exact: true }).click();

    await expect(page.getByText('No memes found for the given criteria.')).toBeVisible();
  });

});