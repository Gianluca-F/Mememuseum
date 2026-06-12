import { test as base } from '@playwright/test';

export const test = base.extend<{ user: { userName: string; password: string; token: string } }>({
  user: async ({ request }, use) => {
    const uid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const userName = `e2e_${uid}`;
    const password = 'seCurep4ass';
    const res = await request.post('http://localhost:3000/auth/signup', { data: { userName, password } });
    const { token } = await res.json();
    await use({ userName, password, token }); // ogni test ha il SUO utente → zero collisioni
  },
});
export { expect } from '@playwright/test';
