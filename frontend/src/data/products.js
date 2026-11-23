export const products = [
  {
    id: 1,
    name: "Tênis Nike Esportivo",
    category: "Tênis",
    brand: "Nike",
    image: "/produc-image-1.jpeg",
    price: 299.90,
    oldPrice: 399.90,
  },
  {
    id: 2,
    name: "Tênis Casual",
    category: "Tênis",
    brand: "Adidas",
    image: "/produc-image-2.jpeg",
    price: 219.90,
    oldPrice: 299.90,
  },
  {
    id: 3,
    name: "Tênis Nike Urban",
    category: "Tênis",
    brand: "Nike",
    image: "/produc-image-3.jpeg",
    price: 349.90,
    oldPrice: 449.90,
  },
  {
    id: 4,
    name: "Tênis Converse",
    category: "Tênis",
    brand: "Converse",
    image: "/produc-image-4.jpeg",
    price: 259.90,
    oldPrice: 329.90,
  },
  {
    id: 5,
    name: "Tênis Running",
    category: "Tênis",
    brand: "Nike",
    image: "/produc-image-5.jpeg",
    price: 279.90,
    oldPrice: 359.90,
  },
];

export function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}