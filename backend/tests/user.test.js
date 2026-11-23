
jest.mock('../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const { User } = require('../src/models');
const bcrypt = require('bcrypt');
const { createUser } = require('../src/services/userService');

const validUser = {
  firstname: 'João',
  surname: 'Silva',
  email: 'joao@example.com',
  password: 'Teste@12345',
  confirmPassword: 'Teste@12345',
};

beforeEach(() => {
  jest.clearAllMocks();

  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hash-seguro');

  User.create.mockImplementation(async (data) => ({
    id: 1,
    ...data,
  }));
});

describe('Cadastro de usuários', () => {
  test('deve cadastrar um usuário válido', async () => {
    const result = await createUser(validUser);

    expect(result.id).toBe(1);
    expect(result.email).toBe('joao@example.com');

    expect(bcrypt.hash).toHaveBeenCalledWith(
      'Teste@12345',
      12
    );

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hash-seguro',
      })
    );

    expect(result).not.toHaveProperty('password');
  });

  test('deve rejeitar senhas diferentes', async () => {
    await expect(
      createUser({
        ...validUser,
        confirmPassword: 'SenhaDiferente',
      })
    ).rejects.toThrow('As senhas não coincidem.');

    expect(User.create).not.toHaveBeenCalled();
  });

  test('deve rejeitar e-mail duplicado', async () => {
    User.findOne.mockResolvedValue({ id: 99 });

    await expect(
      createUser(validUser)
    ).rejects.toThrow('E-mail já cadastrado.');

    expect(User.create).not.toHaveBeenCalled();
  });

  test('deve rejeitar e-mail inválido', async () => {
    await expect(
      createUser({
        ...validUser,
        email: 'email-invalido',
      })
    ).rejects.toThrow('E-mail inválido.');
  });

  test('deve rejeitar senha curta', async () => {
    await expect(
      createUser({
        ...validUser,
        password: '123',
        confirmPassword: '123',
      })
    ).rejects.toThrow(
      'A senha deve conter pelo menos 8 caracteres.'
    );
  });
});
