
const { ProductOption } = require('../models');

class OptionValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function normalizeRadius(value) {
  if (value === undefined) return undefined;

  const text = String(value);
  if (!/^\d+(px)?$/.test(text)) {
    throw new OptionValidationError('Radius inválido.');
  }

  const radius = Number(text.replace('px', ''));

  if (!Number.isSafeInteger(radius) || radius > 1000) {
    throw new OptionValidationError('Radius inválido.');
  }

  return radius;
}

function normalizeValues(data) {
  const values = data.values ?? data.value;

  if (values === undefined) return undefined;

  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    values.some(value =>
      typeof value !== 'string' ||
      !value.trim() ||
      value.includes(',')
    )
  ) {
    throw new OptionValidationError(
      'Values deve ser uma lista de textos válidos.'
    );
  }

  const result = values.map(value => value.trim());

  if (
    new Set(result).size !== result.length ||
    result.join(',').length > 255
  ) {
    throw new OptionValidationError(
      'Values contém duplicidades ou excede o limite.'
    );
  }

  return result.join(',');
}

function validateOption(data, partial = false) {
  if (!data || typeof data !== 'object' ||
      Array.isArray(data)) {
    throw new OptionValidationError('Opção inválida.');
  }

  const values = {};

  if (data.title !== undefined) {
    if (
      typeof data.title !== 'string' ||
      !data.title.trim()
    ) {
      throw new OptionValidationError('Título inválido.');
    }

    values.title = data.title.trim();
  } else if (!partial) {
    throw new OptionValidationError('Título obrigatório.');
  }

  if (data.shape !== undefined) {
    if (!['square', 'circle'].includes(data.shape)) {
      throw new OptionValidationError('Shape inválido.');
    }
    values.shape = data.shape;
  }

  if (data.type !== undefined) {
    if (!['text', 'color'].includes(data.type)) {
      throw new OptionValidationError('Type inválido.');
    }
    values.type = data.type;
  }

  const radius = normalizeRadius(data.radius);
  if (radius !== undefined) values.radius = radius;

  const optionValues = normalizeValues(data);

  if (optionValues !== undefined) {
    values.values = optionValues;
  } else if (!partial) {
    throw new OptionValidationError('Values obrigatório.');
  }

  return values;
}

async function saveProductOptions(
  productId,
  options,
  transaction
) {
  if (options === undefined) return;

  if (!Array.isArray(options)) {
    throw new OptionValidationError(
      'Options deve ser uma lista.'
    );
  }

  const processedIds = new Set();

  for (const item of options) {
    if (!item || typeof item !== 'object' ||
        Array.isArray(item)) {
      throw new OptionValidationError('Opção inválida.');
    }

    if (item.id !== undefined) {
      const id = Number(item.id);

      if (
        !Number.isSafeInteger(id) ||
        id < 1 ||
        processedIds.has(id)
      ) {
        throw new OptionValidationError(
          'ID de opção inválido ou duplicado.'
        );
      }

      processedIds.add(id);

      const existing = await ProductOption.findOne({
        where: { id, product_id: productId },
        transaction,
      });

      if (!existing) {
        throw new OptionValidationError(
          'Opção não pertence ao produto.'
        );
      }

      if (item.deleted === true) {
        await existing.destroy({ transaction });
        continue;
      }

      const values = validateOption(item, true);

      if (Object.keys(values).length > 0) {
        await existing.update(values, { transaction });
      }
    } else {
      if (item.deleted === true) {
        throw new OptionValidationError(
          'Não é possível excluir opção sem ID.'
        );
      }

      const values = validateOption(item);

      await ProductOption.create({
        product_id: productId,
        ...values,
      }, { transaction });
    }
  }
}

module.exports = {
  validateOption,
  saveProductOptions,
  OptionValidationError,
};
