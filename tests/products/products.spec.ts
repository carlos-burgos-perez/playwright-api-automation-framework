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

test('Should create a new product', async ({ request }) => {
    const ProductData = {
        title: 'QA Automation Product',
        description: 'This is a product created for QA automation testing.',
        price: 99.99,
        brand: 'QA Automation',
        category: 'testing',
    };

    const response = await request.post('/products/add', {
        data: ProductData,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.id).toBeDefined();
    expect(body.title).toEqual(ProductData.title);
    expect(body.description).toContain('QA automation testing');
    expect(body.description).toBe(ProductData.description);
    expect(body.price).toEqual(ProductData.price);
    expect(body.brand).toEqual(ProductData.brand);
    expect(body.category).toEqual(ProductData.category);
});

test('Should create a product without a title', async ({ request }) => {
    const response = await request.post('/products/add', {
        data: {
            price: 99.99,
        },
    });
    
    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.id).toEqual(expect.any(Number));
    expect(body.price).toEqual(99.99);

});

test('Should update a product', async ({ request }) => {
    const ProductData = {
        title: 'Updated QA Automation Product',
        description: 'This is an updated product for QA automation testing.',
        price: 149.99,
        brand: 'QA Automation Updated',
        category: 'testing-updated',
    };

    const response = await request.put('/products/1', {
        data: ProductData,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.title).toEqual(ProductData.title);
    expect(body.price).toEqual(ProductData.price);
});

test('Should partially update a product', async ({ request }) => {
    const updateData = {
        price: 199.99,
    };

    const response = await request.patch('/products/1', {
        data: updateData,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.price).toEqual(updateData.price);
});

test('Should delete a product', async ({ request }) => {
    const response = await request.delete('/products/1');
    
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
});