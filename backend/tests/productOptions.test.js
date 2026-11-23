
jest.mock('../src/models', () => ({
  ProductOption: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const { ProductOption } = require('../src/models');

const {
  validateOption,
  saveProductOptions,
} = require('../src/services/productOptionsService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Opções de produtos', () => {
  test('converte radius e lista de valores', () => {
    const result = validateOption({
      title: 'Tamanho',
      shape: 'square',
      radius: '4px',
      type: 'text',
      value: ['P', 'M', 'G'],
    });

    expect(result.radius).toBe(4);
    expect(result.values).toBe('P,M,G');
  });

  test('aceita valores na propriedade values', () => {
    const result = validateOption({
      title: 'Cor',
      values: ['#000', '#FFF'],
    });

    expect(result.values).toBe('#000,#FFF');
  });

  test('rejeita shape inválido', () => {
    expect(() => validateOption({
      title: 'Tamanho',
      shape: 'triangle',
      values: ['P'],
    })).toThrow('Shape inválido.');
  });

  test('rejeita valores duplicados', () => {
    expect(() => validateOption({
      title: 'Tamanho',
      values: ['P', 'P'],
    })).toThrow();
  });

  test('cria opção associada ao produto', async () => {
    await saveProductOptions(1, [{
      title: 'Tamanho',
      values: ['P', 'M'],
    }], {});

    expect(ProductOption.create).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: 1,
        values: 'P,M',
      }),
      expect.any(Object)
    );
  });

  test('não permite editar opção de outro produto', async () => {
    ProductOption.findOne.mockResolvedValue(null);

    await expect(
      saveProductOptions(1, [{
        id: 99,
        values: ['G'],
      }], {})
    ).rejects.toThrow(
      'Opção não pertence ao produto.'
    );
  });
});
