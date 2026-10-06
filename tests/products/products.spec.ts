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

test('Should limit the number of returned products', async ({ request }) => {
    const response = await request.get('/products?limit=5');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.products.length).toBeLessThanOrEqual(5);
});

test('Should paginate products correctly', async ({ request }) => {

    const firstPageResponse = await request.get('/products?limit=5');
    expect(firstPageResponse.status()).toBe(200);
    const firstPage = await firstPageResponse.json();

    const secondPageResponse = await request.get('/products?limit=5&skip=5');
    expect(secondPageResponse.status()).toBe(200);
    const secondPage = await secondPageResponse.json();

    expect(firstPage.products).toHaveLength(5);
    expect(secondPage.products).toHaveLength(5);
    expect(secondPage.products[0].id).not.toEqual(firstPage.products[0].id);
});

test('Should search products by query', async ({ request }) => {
    const response = await request.get('/products/search?q=phone');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);

    const hasMatchingProduct = body.products.some((product: { title:string }) =>
        product.title.toLowerCase().includes('phone')
    );
    
    expect(hasMatchingProduct).toBe(true);
});