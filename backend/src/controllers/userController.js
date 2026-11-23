
const userService = require('../services/userService');

async function store(req, res) {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json(user);
  } catch (error) {
    return handleError(error, res);
  }
}

async function show(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return handleError(error, res);
  }
}

async function update(req, res) {
  try {
    const updated = await userService.updateUser(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

async function destroy(req, res) {
  try {
    const deleted = await userService.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

function handleError(error, res) {
  if (error instanceof userService.ValidationError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error('Erro no módulo de usuários:', error);

  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}

module.exports = {
  store,
  show,
  update,
  destroy,
};
