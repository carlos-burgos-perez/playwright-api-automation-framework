import { test, expect } from '@playwright/test';

test('Should return the products list', async ({ request }) => {
    const response = await request.get('/products');

    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log(body);

    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThan(0);

    const firstProduct = body.products[0];

    expect(firstProduct.id).toEqual(expect.any(Number));
    expect(firstProduct.title).toEqual(expect.any(String));
    expect(firstProduct.price).toEqual(expect.any(Number));
    expect(firstProduct.price).toBeGreaterThanOrEqual(0);
});