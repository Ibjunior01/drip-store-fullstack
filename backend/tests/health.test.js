
const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('deve retornar HTTP 200', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'drip-store-api',
    });
  });

  it('deve retornar HTTP 404 para rota inexistente', async () => {
    const response = await request(app).get('/rota-inexistente');

    expect(response.status).toBe(404);
  });
});
