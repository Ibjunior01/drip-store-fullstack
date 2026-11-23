
const { Category } = require('../models');

class CategoryValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function parseId(id) {
  const value = String(id);

  if (
    !/^[1-9]\d*$/.test(value) ||
    !Number.isSafeInteger(Number(value))
  ) {
    return null;
  }

  return Number(value);
}

function validateCategory(data) {
  const { name, slug, use_in_menu = false } = data || {};

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof slug !== 'string' ||
    !slug.trim()
  ) {
    throw new CategoryValidationError(
      'Nome e slug são obrigatórios.'
    );
  }

  if (
    typeof use_in_menu !== 'boolean'
  ) {
    throw new CategoryValidationError(
      'use_in_menu deve ser booleano.'
    );
  }

  return {
    name: name.trim(),
    slug: slug.trim(),
    use_in_menu,
  };
}

function serializeCategory(category, fields) {
  const data = category.get({ plain: true });

  const allowed = fields || [
    'id',
    'name',
    'slug',
    'use_in_menu',
  ];

  return Object.fromEntries(
    allowed.map(field => [field, data[field]])
  );
}

function parseSearchParams(query = {}) {
  const limitText = query.limit ?? '12';
  const pageText = query.page ?? '1';

  if (
    !/^(?:-1|[1-9]\d*)$/.test(String(limitText)) ||
    !/^[1-9]\d*$/.test(String(pageText))
  ) {
    throw new CategoryValidationError(
      'Parâmetros de paginação inválidos.'
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
    throw new CategoryValidationError(
      'Parâmetros de paginação fora do intervalo.'
    );
  }

  let fields = null;

  if (query.fields !== undefined) {
    if (typeof query.fields !== 'string') {
      throw new CategoryValidationError(
        'Parâmetro fields inválido.'
      );
    }

    fields = query.fields
      .split(',')
      .map(field => field.trim());

    const allowed = [
      'id',
      'name',
      'slug',
      'use_in_menu',
    ];

    if (
      fields.length === 0 ||
      fields.some(field => !allowed.includes(field))
    ) {
      throw new CategoryValidationError(
        'Campos de consulta inválidos.'
      );
    }

    fields = [...new Set(fields)];
  }

  let useInMenu;

  if (query.use_in_menu !== undefined) {
    if (
      query.use_in_menu !== 'true' &&
      query.use_in_menu !== 'false'
    ) {
      throw new CategoryValidationError(
        'use_in_menu deve ser true ou false.'
      );
    }

    useInMenu = query.use_in_menu === 'true';
  }

  return { limit, page, fields, useInMenu };
}

async function searchCategories(query) {
  const { limit, page, fields, useInMenu } =
    parseSearchParams(query);

  const where = {};

  if (useInMenu !== undefined) {
    where.use_in_menu = useInMenu;
  }

  const options = {
    where,
    order: [['id', 'ASC']],
  };

  if (fields) {
    options.attributes = fields;
  }

  if (limit !== -1) {
    options.limit = limit;
    options.offset = (page - 1) * limit;
  }

  const { rows, count } =
    await Category.findAndCountAll(options);

  return {
    data: rows.map(row => serializeCategory(row, fields)),
    total: count,
    limit,
    page: limit === -1 ? 1 : page,
  };
}

async function getCategoryById(id) {
  const categoryId = parseId(id);

  if (!categoryId) return null;

  const category = await Category.findByPk(categoryId);

  return category
    ? serializeCategory(category)
    : null;
}

async function createCategory(data) {
  const values = validateCategory(data);

  const category = await Category.create(values);

  return serializeCategory(category);
}

async function updateCategory(id, data) {
  const categoryId = parseId(id);

  if (!categoryId) return false;

  const category = await Category.findByPk(categoryId);

  if (!category) return false;

  const values = validateCategory(data);

  await category.update(values);

  return true;
}

async function deleteCategory(id) {
  const categoryId = parseId(id);

  if (!categoryId) return false;

  const category = await Category.findByPk(categoryId);

  if (!category) return false;

  await category.destroy();

  return true;
}

module.exports = {
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryValidationError,
};
