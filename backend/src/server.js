
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Drip Store API executando na porta ${PORT}`);
});
