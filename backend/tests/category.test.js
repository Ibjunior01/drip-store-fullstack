
process.env.JWT_SECRET = 'chave-exclusiva-para-testes';

jest.mock('../src/services/categoryService', () => {
  class CategoryValidationError extends Error {}

  return {
    searchCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    CategoryValidationError,
  };
});

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const service = require('../src/services/categoryService');

let token;

const sample = {
  id: 1,
  name: 'Calçados',
  slug: 'calcados',
  use_in_menu: true,
};

beforeEach(() => {
  jest.resetAllMocks();

  token = jwt.sign(
    { sub: '1' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

describe('Rotas de categorias', () => {
  test('GET /search retorna dados paginados', async () => {
    service.searchCategories.mockResolvedValue({
      data: [sample],
      total: 1,
      limit: 12,
      page: 1,
    });

    const response = await request(app)
      .get('/v1/category/search');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.total).toBe(1);
  });

  test('GET /:id consulta uma categoria', async () => {
    service.getCategoryById.mockResolvedValue(sample);

    const response = await request(app)
      .get('/v1/category/1');

    expect(response.status).toBe(200);
    expect(response.body.slug).toBe('calcados');
  });

  test('GET /:id retorna 404', async () => {
    service.getCategoryById.mockResolvedValue(null);

    const response = await request(app)
      .get('/v1/category/999');

    expect(response.status).toBe(404);
  });

  test('POST exige JWT', async () => {
    const response = await request(app)
      .post('/v1/category')
      .send(sample);

    expect(response.status).toBe(401);
  });

  test('POST cria categoria autenticada', async () => {
    service.createCategory.mockResolvedValue(sample);

    const response = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Calçados',
        slug: 'calcados',
        use_in_menu: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
  });

  test('POST rejeita dados inválidos', async () => {
    service.createCategory.mockRejectedValue(
      new service.CategoryValidationError(
        'Nome e slug são obrigatórios.'
      )
    );

    const response = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(response.status).toBe(400);
  });

  test('PUT atualiza categoria autenticada', async () => {
    service.updateCategory.mockResolvedValue(true);

    const response = await request(app)
      .put('/v1/category/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tênis',
        slug: 'tenis',
        use_in_menu: true,
      });

    expect(response.status).toBe(204);
  });

  test('DELETE exige JWT', async () => {
    const response = await request(app)
      .delete('/v1/category/1');

    expect(response.status).toBe(401);
  });

  test('DELETE autenticado retorna 204', async () => {
    service.deleteCategory.mockResolvedValue(true);

    const response = await request(app)
      .delete('/v1/category/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('DELETE retorna 404 se não existir', async () => {
    service.deleteCategory.mockResolvedValue(false);

    const response = await request(app)
      .delete('/v1/category/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
