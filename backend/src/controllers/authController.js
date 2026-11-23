
const {
  authenticateUser,
  AuthError,
} = require('../services/authService');

async function login(req, res) {
  try {
    const result = await authenticateUser(req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error('Erro de autenticação:', error);

    return res.status(500).json({
      message: 'Erro interno do servidor.',
    });
  }
}

module.exports = { login };
