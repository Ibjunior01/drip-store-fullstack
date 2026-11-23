
const database = require('./database');

async function testConnection() {
  try {
    await database.authenticate();

    console.log('Conexão com MySQL estabelecida com sucesso!');

    const [result] = await database.query(
      'SELECT DATABASE() AS database_name, VERSION() AS mysql_version'
    );

    console.log(result[0]);
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
    process.exitCode = 1;
  } finally {
    await database.close();
  }
}

testConnection();
