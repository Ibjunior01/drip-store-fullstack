
const service = require('../services/productService');

function handleError(error, res) {
  if (
    error instanceof service.ProductValidationError ||
    error instanceof service.OptionValidationError
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error('Erro no módulo de produtos:', error);

  return res.status(500).json({
    message: 'Erro interno do servidor.',
  });
}

async function search(req, res) {
  try {
    const result = await service.searchProducts(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
}

async function show(req, res) {
  try {
    const product = await service.getProductById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: 'Produto não encontrado.',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(error, res);
  }
}

async function store(req, res) {
  try {
    const result = await service.createProduct(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return handleError(error, res);
  }
}

async function update(req, res) {
  try {
    const updated = await service.updateProduct(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Produto não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

async function destroy(req, res) {
  try {
    const deleted = await service.deleteProduct(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: 'Produto não encontrado.',
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
