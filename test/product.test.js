const request = require('supertest');
const assert = require('assert');
const app = require('../src/app');
const productRepository = require('../src/data/memory.repository');

describe('Product API - Functional Tests', () => {
  beforeEach(() => {
    productRepository.clear();
  });

  describe('Health and documentation', () => {
    it('should return the health check payload', async () => {
      const response = await request(app).get('/health');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.status, 'OK');
      assert.strictEqual(response.body.message, 'API is running');
      assert.ok(response.body.timestamp);
    });

    it('should return root metadata with documentation url', async () => {
      const response = await request(app).get('/');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.message, 'Bem-vindo à API de Cadastro de Produtos');
      assert.strictEqual(response.body.version, '1.0.0');
      assert.strictEqual(response.body.documentation, 'http://localhost:5000/api/docs');
    });

    it('should expose swagger documentation HTML', async () => {
      const response = await request(app).get('/api/docs/');

      assert.strictEqual(response.status, 200);
      assert.ok(response.text.includes('Swagger UI') || response.text.includes('swagger'));
      assert.ok(response.headers['content-type'].includes('text/html'));
    });
  });

  describe('POST /api/products', () => {
    it('should create a product when payload is valid', async () => {
      const payload = {
        name: 'Notebook Dell',
        price: 2499.99,
        quantity: 10,
        category: 'Eletrônicos'
      };

      const response = await request(app)
        .post('/api/products')
        .send(payload);

      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.message, 'Product created successfully');
      assert.strictEqual(response.body.data.name, payload.name);
      assert.strictEqual(response.body.data.price, payload.price);
      assert.strictEqual(response.body.data.quantity, payload.quantity);
      assert.strictEqual(response.body.data.category, payload.category);
      assert.strictEqual(typeof response.body.data.id, 'number');
    });

    it('should return validation error when payload is missing required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({});

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Validation error');
      assert.ok(Array.isArray(response.body.errors));
      assert.ok(response.body.errors.some(err => err.field === 'name'));
      assert.ok(response.body.errors.some(err => err.field === 'price'));
      assert.ok(response.body.errors.some(err => err.field === 'quantity'));
      assert.ok(response.body.errors.some(err => err.field === 'category'));
    });

    it('should allow border values for minimum constraints', async () => {
      const payload = {
        name: 'ABC',
        price: 0.01,
        quantity: 0,
        category: 'A'
      };

      const response = await request(app)
        .post('/api/products')
        .send(payload);

      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.data.name, payload.name);
      assert.strictEqual(response.body.data.price, payload.price);
      assert.strictEqual(response.body.data.quantity, payload.quantity);
      assert.strictEqual(response.body.data.category, payload.category);
    });

    it('should return validation error when price is too low', async () => {
      const payload = {
        name: 'Produto Teste',
        price: 0,
        quantity: 1,
        category: 'Teste'
      };

      const response = await request(app)
        .post('/api/products')
        .send(payload);

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.success, false);
      assert.ok(response.body.errors.some(err => err.field === 'price'));
    });

    it('should return validation error when quantity is negative', async () => {
      const payload = {
        name: 'Produto Teste',
        price: 1.5,
        quantity: -1,
        category: 'Teste'
      };

      const response = await request(app)
        .post('/api/products')
        .send(payload);

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.success, false);
      assert.ok(response.body.errors.some(err => err.field === 'quantity'));
    });
  });

  describe('GET /api/products', () => {
    it('should return an empty list when there are no products', async () => {
      const response = await request(app).get('/api/products');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.deepStrictEqual(response.body.data, []);
    });

    it('should return a list with created products', async () => {
      await request(app)
        .post('/api/products')
        .send({ name: 'Produto A', price: 10, quantity: 2, category: 'A' });

      await request(app)
        .post('/api/products')
        .send({ name: 'Produto B', price: 15, quantity: 3, category: 'B' });

      const response = await request(app).get('/api/products');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.ok(Array.isArray(response.body.data));
      assert.strictEqual(response.body.data.length, 2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product by id', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({ name: 'Produto Unico', price: 50, quantity: 5, category: 'Unico' });

      const id = createResponse.body.data.id;
      const response = await request(app).get(`/api/products/${id}`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.data.id, id);
      assert.strictEqual(response.body.data.name, 'Produto Unico');
    });

    it('should return 404 when product does not exist', async () => {
      const response = await request(app).get('/api/products/999');

      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Product not found');
    });

    it('should return validation error for invalid id', async () => {
      const response = await request(app).get('/api/products/abc');

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Validation error');
      assert.ok(response.body.errors.some(err => err.field === 'id'));
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product completely', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({ name: 'Produto Put', price: 100, quantity: 10, category: 'Put' });

      const id = createResponse.body.data.id;
      const updatePayload = {
        name: 'Produto Put Atualizado',
        price: 120.5,
        quantity: 20,
        category: 'Put Atualizado'
      };

      const response = await request(app)
        .put(`/api/products/${id}`)
        .send(updatePayload);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.data.name, updatePayload.name);
      assert.strictEqual(response.body.data.price, updatePayload.price);
      assert.strictEqual(response.body.data.quantity, updatePayload.quantity);
      assert.strictEqual(response.body.data.category, updatePayload.category);
    });

    it('should return 404 when updating a non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .send({ name: 'Nao existe', price: 10, quantity: 1, category: 'Teste' });

      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Product not found');
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('should partially update a product when valid fields are provided', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({ name: 'Produto Patch', price: 50, quantity: 4, category: 'Patch' });

      const id = createResponse.body.data.id;
      const response = await request(app)
        .patch(`/api/products/${id}`)
        .send({ price: 75 });

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.data.id, id);
      assert.strictEqual(response.body.data.price, 75);
      assert.strictEqual(response.body.data.name, 'Produto Patch');
    });

    it('should return 400 when no fields are sent', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({ name: 'Produto Patch2', price: 60, quantity: 6, category: 'Patch2' });

      const id = createResponse.body.data.id;
      const response = await request(app)
        .patch(`/api/products/${id}`)
        .send({});

      assert.strictEqual(response.status, 400);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'At least one field must be provided for update');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product and prevent retrieval afterwards', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({ name: 'Produto Delete', price: 40, quantity: 4, category: 'Delete' });

      const id = createResponse.body.data.id;
      const deleteResponse = await request(app).delete(`/api/products/${id}`);

      assert.strictEqual(deleteResponse.status, 200);
      assert.strictEqual(deleteResponse.body.success, true);
      assert.strictEqual(deleteResponse.body.message, 'Product deleted successfully');

      const getResponse = await request(app).get(`/api/products/${id}`);
      assert.strictEqual(getResponse.status, 404);
    });

    it('should return 404 when deleting a non-existent product', async () => {
      const response = await request(app).delete('/api/products/999');

      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.success, false);
      assert.strictEqual(response.body.message, 'Product not found');
    });
  });
});
