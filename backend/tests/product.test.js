
process.env.JWT_SECRET = 'chave-exclusiva-para-testes';

jest.mock('../src/services/productService', () => {
  class ProductValidationError extends Error {}

  return {
    searchProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    ProductValidationError,
  };
});

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const service = require('../src/services/productService');

const product = {
  id: 1,
  enabled: true,
  name: 'Tênis Drip',
  slug: 'tenis-drip',
  stock: 10,
  description: 'Tênis casual',
  price: 199.9,
  price_with_discount: 179.9,
  category_ids: [1],
  images: [],
  options: [],
};

const payload = {
  enabled: true,
  name: 'Tênis Drip',
  slug: 'tenis-drip',
  stock: 10,
  description: 'Tênis casual',
  price: 199.9,
  price_with_discount: 179.9,
  category_ids: [1],
};

let token;

beforeEach(() => {
  jest.resetAllMocks();

  token = jwt.sign(
    { sub: '1' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

describe('API de produtos', () => {
  test('GET /search retorna produtos paginados', async () => {
    service.searchProducts.mockResolvedValue({
      data: [product],
      total: 1,
      limit: 12,
      page: 1,
    });

    const response = await request(app)
      .get('/v1/product/search');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.total).toBe(1);
  });

  test('GET /:id retorna produto existente', async () => {
    service.getProductById.mockResolvedValue(product);

    const response = await request(app)
      .get('/v1/product/1');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Tênis Drip');
  });

  test('GET /:id retorna 404 para inexistente', async () => {
    service.getProductById.mockResolvedValue(null);

    const response = await request(app)
      .get('/v1/product/999');

    expect(response.status).toBe(404);
  });

  test('POST exige autenticação', async () => {
    const response = await request(app)
      .post('/v1/product')
      .send(payload);

    expect(response.status).toBe(401);
  });

  test('POST cria produto com JWT', async () => {
    service.createProduct.mockResolvedValue({ id: 1 });

    const response = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
  });

  test('POST rejeita dados inválidos', async () => {
    service.createProduct.mockRejectedValue(
      new service.ProductValidationError(
        'Preços inválidos.'
      )
    );

    const response = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...payload, price: -10 });

    expect(response.status).toBe(400);
  });

  test('PUT atualiza produto autenticado', async () => {
    service.updateProduct.mockResolvedValue(true);

    const response = await request(app)
      .put('/v1/product/1')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(204);
  });

  test('DELETE exige JWT', async () => {
    const response = await request(app)
      .delete('/v1/product/1');

    expect(response.status).toBe(401);
  });

  test('DELETE autenticado retorna 204', async () => {
    service.deleteProduct.mockResolvedValue(true);

    const response = await request(app)
      .delete('/v1/product/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('DELETE retorna 404 se não existir', async () => {
    service.deleteProduct.mockResolvedValue(false);

    const response = await request(app)
      .delete('/v1/product/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
