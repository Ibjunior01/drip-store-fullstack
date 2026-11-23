
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


function validateId(id) {
  const value = String(id);

  if (!/^[1-9]\d*$/.test(value) ||
      !Number.isSafeInteger(Number(value))) {
    return null;
  }

  return Number(value);
}

function publicUser(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    surname: user.surname,
    email: user.email,
  };
}

async function getUserById(id) {
  const userId = validateId(id);

  if (!userId) return null;

  const user = await User.findByPk(userId);

  return user ? publicUser(user) : null;
}

async function updateUser(id, data) {
  const userId = validateId(id);

  if (!userId) return false;

  const user = await User.findByPk(userId);

  if (!user) return false;

  const { firstname, surname, email } = data || {};

  if (
    typeof firstname !== 'string' ||
    !firstname.trim() ||
    typeof surname !== 'string' ||
    !surname.trim() ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw new ValidationError('Dados inválidos.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (existing && existing.id !== user.id) {
    throw new ValidationError('E-mail já cadastrado.');
  }

  await user.update({
    firstname: firstname.trim(),
    surname: surname.trim(),
    email: normalizedEmail,
  });

  return true;
}

async function deleteUser(id) {
  const userId = validateId(id);

  if (!userId) return false;

  const user = await User.findByPk(userId);

  if (!user) return false;

  await user.destroy();

  return true;
}


module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  ValidationError,
};
