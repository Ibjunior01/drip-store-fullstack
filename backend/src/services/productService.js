
const { Op } = require('sequelize');

const {
  sequelize,
  Product,
  Category,
  ProductImage,
  ProductOption,
} = require('../models');

const {
  saveProductOptions,
  OptionValidationError,
} = require('./productOptionsService');

class ProductValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const publicFields = [
  'id', 'enabled', 'name', 'slug', 'use_in_menu',
  'stock', 'description', 'price',
  'price_with_discount', 'category_ids',
  'images', 'options',
];

function parseId(id) {
  const value = String(id);

  if (!/^[1-9]\d*$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function validateProduct(data) {
  if (!data || typeof data !== 'object' ||
      Array.isArray(data)) {
    throw new ProductValidationError('Produto inválido.');
  }

  const {
    name, slug, enabled = false,
    use_in_menu = false, stock = 0,
    description = null, price,
    price_with_discount, category_ids = [],
  } = data;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof slug !== 'string' || !slug.trim()
  ) {
    throw new ProductValidationError(
      'Nome e slug são obrigatórios.'
    );
  }

  if (
    typeof enabled !== 'boolean' ||
    typeof use_in_menu !== 'boolean' ||
    !Number.isSafeInteger(stock) || stock < 0
  ) {
    throw new ProductValidationError(
      'Status ou estoque inválido.'
    );
  }

  if (
    typeof price !== 'number' ||
    typeof price_with_discount !== 'number' ||
    !Number.isFinite(price) ||
    !Number.isFinite(price_with_discount) ||
    price < 0 || price_with_discount < 0 ||
    price_with_discount > price
  ) {
    throw new ProductValidationError(
      'Preços inválidos.'
    );
  }

  if (
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new ProductValidationError(
      'Descrição inválida.'
    );
  }

  if (
    !Array.isArray(category_ids) ||
    category_ids.some(id => !parseId(id)) ||
    new Set(category_ids.map(Number)).size !==
      category_ids.length
  ) {
    throw new ProductValidationError(
      'IDs de categorias inválidos.'
    );
  }

  // Etapa 09B implementará essas operações.
  // Não ignoramos imagens ou opções silenciosamente.
  if (
    data.images !== undefined &&
    (!Array.isArray(data.images) || data.images.length > 0)
  ) {
    throw new ProductValidationError(
      'Imagens serão implementadas no módulo 09B.2.'
    );
  }

  return {
    values: {
      name: name.trim(),
      slug: slug.trim(),
      enabled,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
    },
    categoryIds: category_ids.map(Number),
    options: data.options,
  };
}

function includes() {
  return [
    {
      model: Category,
      as: 'categories',
      attributes: ['id'],
      through: { attributes: [] },
    },
    {
      model: ProductImage,
      as: 'images',
      attributes: ['id', 'path', 'enabled'],
    },
    {
      model: ProductOption,
      as: 'options',
    },
  ];
}

function serializeProduct(product, fields = null) {
  const data = product.get({ plain: true });

  const result = {
    id: data.id,
    enabled: Boolean(data.enabled),
    name: data.name,
    slug: data.slug,
    use_in_menu: Boolean(data.use_in_menu),
    stock: data.stock,
    description: data.description,
    price: data.price,
    price_with_discount: data.price_with_discount,
    category_ids: (data.categories || []).map(c => c.id),
    images: (data.images || []).map(image => ({
      id: image.id,
      content: image.path,
    })),
    options: (data.options || []).map(option => ({
      id: option.id,
      title: option.title,
      shape: option.shape,
      radius: option.radius,
      type: option.type,
      values: option.values
        ? option.values.split(',')
        : [],
    })),
  };

  if (!fields) return result;

  return Object.fromEntries(
    fields.map(field => [field, result[field]])
  );
}

function parseSearch(query = {}) {
  const limitText = String(query.limit ?? '12');
  const pageText = String(query.page ?? '1');

  if (
    !/^(?:-1|[1-9]\d*)$/.test(limitText) ||
    !/^[1-9]\d*$/.test(pageText)
  ) {
    throw new ProductValidationError(
      'Paginação inválida.'
    );
  }

  const limit = Number(limitText);
  const page = Number(pageText);

  if (
    !Number.isSafeInteger(limit) ||
    !Number.isSafeInteger(page) ||
    (limit !== -1 &&
      !Number.isSafeInteger((page - 1) * limit))
  ) {
    throw new ProductValidationError(
      'Paginação fora do intervalo.'
    );
  }

  let fields = null;

  if (query.fields !== undefined) {
    if (typeof query.fields !== 'string') {
      throw new ProductValidationError(
        'Seleção de campos inválida.'
      );
    }

    fields = [...new Set(
      query.fields.split(',').map(f => f.trim())
    )];

    if (
      fields.some(f => !publicFields.includes(f)) ||
      fields.includes('')
    ) {
      throw new ProductValidationError(
        'Campos solicitados inválidos.'
      );
    }
  }

  const where = {};
  const categoryIds = [];

  if (query.match !== undefined) {
    if (typeof query.match !== 'string' ||
        !query.match.trim()) {
      throw new ProductValidationError(
        'Termo de busca inválido.'
      );
    }

    const term = query.match.trim();

    where[Op.or] = [
      { name: { [Op.like]: `%${term}%` } },
      { description: { [Op.like]: `%${term}%` } },
    ];
  }

  if (query.category_ids !== undefined) {
    if (typeof query.category_ids !== 'string') {
      throw new ProductValidationError(
        'Categorias inválidas.'
      );
    }

    for (const value of query.category_ids.split(',')) {
      const id = parseId(value);

      if (!id) {
        throw new ProductValidationError(
          'Categorias inválidas.'
        );
      }

      categoryIds.push(id);
    }
  }

  if (query['price-range'] !== undefined) {
    const range = String(query['price-range']);
    const match = range.match(
      /^(\d+(?:\.\d{1,2})?)-(\d+(?:\.\d{1,2})?)$/
    );

    if (!match || Number(match[1]) > Number(match[2])) {
      throw new ProductValidationError(
        'Faixa de preços inválida.'
      );
    }

    where.price = {
      [Op.between]: [Number(match[1]), Number(match[2])],
    };
  }

  // O filtro por option[id] será implementado na 09B.
  for (const key of Object.keys(query)) {
    if (/^option\[/.test(key)) {
      throw new ProductValidationError(
        'Filtro por opções ainda não implementado.'
      );
    }
  }

  return { limit, page, fields, where, categoryIds };
}

async function searchProducts(query) {
  const params = parseSearch(query);

  const options = {
    where: params.where,
    order: [['id', 'ASC']],
  };

  if (params.categoryIds.length) {
    options.include = [{
      model: Category,
      as: 'categories',
      attributes: [],
      through: { attributes: [] },
      where: {
        id: { [Op.in]: params.categoryIds },
      },
      required: true,
    }];
    options.distinct = true;
  }

  if (params.limit !== -1) {
    options.limit = params.limit;
    options.offset = (params.page - 1) * params.limit;
  }

  const { rows, count } =
    await Product.findAndCountAll(options);

  // Carregamos as relações após a paginação para evitar
  // linhas duplicadas devido a joins com imagens e opções.
  const ids = rows.map(row => row.id);

  const products = ids.length
    ? await Product.findAll({
        where: { id: { [Op.in]: ids } },
        include: includes(),
        order: [['id', 'ASC']],
      })
    : [];

  return {
    data: products.map(p =>
      serializeProduct(p, params.fields)
    ),
    total: count,
    limit: params.limit,
    page: params.limit === -1 ? 1 : params.page,
  };
}

async function getProductById(id) {
  const productId = parseId(id);

  if (!productId) return null;

  const product = await Product.findByPk(productId, {
    include: includes(),
  });

  return product ? serializeProduct(product) : null;
}

async function checkCategories(ids, transaction) {
  if (!ids.length) return;

  const count = await Category.count({
    where: { id: { [Op.in]: ids } },
    transaction,
  });

  if (count !== ids.length) {
    throw new ProductValidationError(
      'Uma ou mais categorias não existem.'
    );
  }
}


async function createProduct(data) {
  const {
    values,
    categoryIds,
    options,
  } = validateProduct(data);

  return sequelize.transaction(async transaction => {
    await checkCategories(categoryIds, transaction);

    const product = await Product.create(values, {
      transaction,
    });

    await product.setCategories(categoryIds, {
      transaction,
    });

    await saveProductOptions(
      product.id,
      options,
      transaction
    );

    return { id: product.id };
  });
}

async function updateProduct(id, data) {
  const productId = parseId(id);

  if (!productId) return false;

  const {
    values,
    categoryIds,
    options,
  } = validateProduct(data);

  return sequelize.transaction(async transaction => {
    const product = await Product.findByPk(productId, {
      transaction,
    });

    if (!product) return false;

    await checkCategories(categoryIds, transaction);

    await product.update(values, { transaction });

    await product.setCategories(categoryIds, {
      transaction,
    });

    await saveProductOptions(
      product.id,
      options,
      transaction
    );

    return true;
  });
}


async function deleteProduct(id) {
  const productId = parseId(id);

  if (!productId) return false;

  return sequelize.transaction(async transaction => {
    const product = await Product.findByPk(productId, {
      transaction,
    });

    if (!product) return false;

    await product.destroy({ transaction });

    return true;
  });
}

module.exports = {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductValidationError,
  OptionValidationError,
};
