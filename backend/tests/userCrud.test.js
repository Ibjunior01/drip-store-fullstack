
process.env.JWT_SECRET = 'chave-exclusiva-para-testes-automatizados';

jest.mock('../src/services/userService', () => {
  class ValidationError extends Error {}

  return {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    ValidationError,
  };
});

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const service = require('../src/services/userService');

let token;

beforeEach(() => {
  jest.resetAllMocks();

  token = jwt.sign(
    { sub: '1' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

describe('CRUD de usuários', () => {
  test('GET retorna usuário sem senha', async () => {
    service.getUserById.mockResolvedValue({
      id: 1,
      firstname: 'João',
      surname: 'Silva',
      email: 'joao@example.com',
    });

    const response = await request(app).get('/v1/user/1');

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
  });

  test('GET retorna 404 para usuário inexistente', async () => {
    service.getUserById.mockResolvedValue(null);

    const response = await request(app).get('/v1/user/999');

    expect(response.status).toBe(404);
  });

  test('PUT exige autenticação', async () => {
    const response = await request(app)
      .put('/v1/user/1')
      .send({
        firstname: 'João',
        surname: 'Atualizado',
        email: 'joao@example.com',
      });

    expect(response.status).toBe(401);
  });

  test('PUT atualiza usuário autenticado', async () => {
    service.updateUser.mockResolvedValue(true);

    const response = await request(app)
      .put('/v1/user/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'João',
        surname: 'Atualizado',
        email: 'joao@example.com',
      });

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });

  test('PUT retorna 400 para dados inválidos', async () => {
    service.updateUser.mockRejectedValue(
      new service.ValidationError('Dados inválidos.')
    );

    const response = await request(app)
      .put('/v1/user/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: '' });

    expect(response.status).toBe(400);
  });

  test('DELETE exige autenticação', async () => {
    const response = await request(app)
      .delete('/v1/user/1');

    expect(response.status).toBe(401);
  });

  test('DELETE remove usuário autenticado', async () => {
    service.deleteUser.mockResolvedValue(true);

    const response = await request(app)
      .delete('/v1/user/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });

  test('DELETE retorna 404 para usuário inexistente', async () => {
    service.deleteUser.mockResolvedValue(false);

    const response = await request(app)
      .delete('/v1/user/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
