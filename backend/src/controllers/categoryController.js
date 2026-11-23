
const categoryService = require('../services/categoryService');

function handleError(error, res) {
  if (
    error instanceof
    categoryService.CategoryValidationError
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error('Erro no módulo de categorias:', error);

  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}

async function search(req, res) {
  try {
    const result =
      await categoryService.searchCategories(req.query);

    return res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
}

async function show(req, res) {
  try {
    const category =
      await categoryService.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Categoria não encontrada.',
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    return handleError(error, res);
  }
}

async function store(req, res) {
  try {
    const category =
      await categoryService.createCategory(req.body);

    return res.status(201).json(category);
  } catch (error) {
    return handleError(error, res);
  }
}

async function update(req, res) {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Categoria não encontrada.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

async function destroy(req, res) {
  try {
    const deleted =
      await categoryService.deleteCategory(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Categoria não encontrada.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

module.exports = {
  search,
  show,
  store,
  update,
  destroy,
};
