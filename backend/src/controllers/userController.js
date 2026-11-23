
const { createUser } = require('../services/userService');

async function store(req, res) {
  try {
    const user = await createUser(req.body);

    return res.status(201).json(user);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error('Erro ao cadastrar usuário:', error);

    return res.status(500).json({
      message: 'Erro interno do servidor.',
    });
  }
}

module.exports = { store };
