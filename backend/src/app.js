
const express = require('express');

const app = express();

// Permite que a API receba dados em formato JSON.
app.use(express.json());

// Endpoint para verificar se a API está funcionando.
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'drip-store-api',
  });
});

module.exports = app;
