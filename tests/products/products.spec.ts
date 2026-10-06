import { test, expect } from '@playwright/test';

test('Should return the products list', async ({ request }) => {
    const response = await request.get('/products');

    expect(response.status()).toBe(200);
});