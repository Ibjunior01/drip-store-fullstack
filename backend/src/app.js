
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'drip-store-api',
  });
});

app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);

module.exports = app;
