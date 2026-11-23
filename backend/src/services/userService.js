
const bcrypt = require('bcrypt');
const { User } = require('../models');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

async function createUser(data) {
  const {
    firstname,
    surname,
    email,
    password,
    confirmPassword,
  } = data;

  // Validação dos campos obrigatórios
  if (
    typeof firstname !== 'string' ||
    !firstname.trim() ||
    typeof surname !== 'string' ||
    !surname.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password ||
    typeof confirmPassword !== 'string' ||
    !confirmPassword
  ) {
    throw new ValidationError('Todos os campos são obrigatórios.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new ValidationError('E-mail inválido.');
  }

  if (password.length < 8) {
    throw new ValidationError(
      'A senha deve conter pelo menos 8 caracteres.'
    );
  }

  if (password !== confirmPassword) {
    throw new ValidationError('As senhas não coincidem.');
  }

  // Verifica se o e-mail já existe
  const existingUser = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new ValidationError('E-mail já cadastrado.');
  }

  // Nunca armazenar a senha original
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstname: firstname.trim(),
    surname: surname.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  // Retorna somente dados públicos
  return {
    id: user.id,
    firstname: user.firstname,
    surname: user.surname,
    email: user.email,
  };
}

module.exports = {
  createUser,
  ValidationError,
};
