import { test as base } from '@playwright/test';

export const test = base.extend<{ user: { userName: string; password: string; token: string } }>({
  user: async ({ request }, use) => {
    const userName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const password = 'qwerty123';
    const res = await request.post('http://localhost:3000/auth/signup', { data: { userName, password } });
    const { token } = await res.json();
    await use({ userName, password, token }); 
  },
});
export { expect } from '@playwright/test';
