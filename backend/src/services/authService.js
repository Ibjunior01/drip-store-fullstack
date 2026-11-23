
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

async function authenticateUser({ email, password } = {}) {
  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    throw new AuthError('E-mail e senha são obrigatórios.');
  }

  const user = await User.findOne({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new AuthError('Credenciais inválidas.');
  }

  const isValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValid) {
    throw new AuthError('Credenciais inválidas.');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado.');
  }

  const token = jwt.sign(
    { sub: String(user.id) },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      algorithm: 'HS256',
    }
  );

  return { token };
}

module.exports = {
  authenticateUser,
  AuthError,
};
