
jest.mock('../src/models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

process.env.JWT_SECRET = 'chave-exclusiva-para-testes-automatizados';
process.env.JWT_EXPIRES_IN = '1h';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../src/models');
const app = require('../src/app');
const authMiddleware = require('../src/middleware/authMiddleware');

const protectedApp = express();

protectedApp.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ userId: req.userId });
});

beforeEach(() => {
  jest.clearAllMocks();

  User.findOne.mockResolvedValue({
    id: 1,
    email: 'joao@example.com',
    password: 'hash-do-banco',
  });

  bcrypt.compare.mockResolvedValue(true);
});

describe('POST /v1/user/token', () => {
  test('retorna JWT para credenciais válidas', async () => {
    const response = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'joao@example.com',
        password: 'Teste@12345',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    const payload = jwt.verify(
      response.body.token,
      process.env.JWT_SECRET
    );

    expect(payload.sub).toBe('1');
  });

  test('rejeita senha incorreta', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'joao@example.com',
        password: 'senha-errada',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Credenciais inválidas.');
  });

  test('rejeita usuário inexistente', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'inexistente@example.com',
        password: 'Teste@12345',
      });

    expect(response.status).toBe(400);
  });
});

describe('Middleware JWT', () => {
  test('rejeita acesso sem token', async () => {
    const response = await request(protectedApp)
      .get('/protected');

    expect(response.status).toBe(401);
  });

  test('aceita token válido', async () => {
    const token = jwt.sign(
      { sub: '1' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(protectedApp)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(1);
  });

  test('rejeita token inválido', async () => {
    const response = await request(protectedApp)
      .get('/protected')
      .set('Authorization', 'Bearer token.invalido.aqui');

    expect(response.status).toBe(401);
  });
});
