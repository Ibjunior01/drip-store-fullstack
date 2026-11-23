
const { sequelize } = require('../models');

async function syncDatabase() {
  try {
    await sequelize.authenticate();

    console.log('MySQL conectado.');

    await sequelize.sync();

    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro na sincronização:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
