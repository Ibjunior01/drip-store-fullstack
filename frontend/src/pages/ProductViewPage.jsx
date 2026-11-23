import { useState } from "react";
import { Link, useParams } from "react-router";

import { products, formatPrice } from "../data/products";
import ProductCard from "../components/products/ProductCard";

import "./ProductViewPage.css";

const sizes = [38, 39, 40, 41, 42];

const colors = [
  { name: "Branco", value: "#ffffff" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Preto", value: "#222222" },
];

const thumbnails = [
  "/product-thumb-1.jpeg",
  "/product-thumb-2.jpeg",
  "/product-thumb-3.jpeg",
  "/product-thumb-4.jpeg",
  "/product-thumb-5.jpeg",
];

function ProductDetails({ product }) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [message, setMessage] = useState("");

  const images = [product.image, ...thumbnails];

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  function handleBuy() {
    if (!selectedSize || !selectedColor) {
      setMessage("Selecione o tamanho e a cor do produto.");
      return;
    }

    setMessage(
      `${product.name} — tamanho ${selectedSize}, cor ${selectedColor.name}. Seleção confirmada!`
    );
  }

  return (
    <main className="details-page">
      <div className="details-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Produtos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="details-layout">
          <div className="details-gallery">
            <div className="details-main-image">
              <img src={activeImage} alt={product.name} />
            </div>

            <div className="details-thumbnails">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={
                    activeImage === image
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => setActiveImage(image)}
                  aria-label={`Visualizar imagem ${index + 1}`}
                  aria-pressed={activeImage === image}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="details-info">
            <h1>{product.name}</h1>

            <p className="details-category">
              {product.category} | {product.brand}
            </p>

            <div className="details-price">
              <s>{formatPrice(product.oldPrice)}</s>
              <strong>{formatPrice(product.price)}</strong>
            </div>

            <p className="details-description">
              Conheça este modelo da Drip Store.
              Escolha o tamanho e a cor de sua preferência.
            </p>

            <div className="details-option">
              <h2>Tamanhos</h2>

              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      selectedSize === size ? "selected" : ""
                    }
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage("");
                    }}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="details-option">
              <h2>Cores</h2>

              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={
                      selectedColor?.name === color.name
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setSelectedColor(color);
                      setMessage("");
                    }}
                    aria-label={`Selecionar cor ${color.name}`}
                    aria-pressed={selectedColor?.name === color.name}
                    title={color.name}
                  >
                    <span
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="details-buy-button"
              onClick={handleBuy}
            >
              COMPRAR
            </button>

            {message && (
              <p className="details-message" role="status">
                {message}
              </p>
            )}
          </div>
        </div>

        <section className="details-related">
          <div className="section-heading">
            <h2>Produtos recomendados</h2>
            <Link to="/products">Ver todos</Link>
          </div>

          <div className="products-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ProductViewPage() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="details-not-found">
        <h1>Produto não encontrado</h1>
        <Link to="/products">Voltar aos produtos</Link>
      </main>
    );
  }

  return <ProductDetails key={product.id} product={product} />;
}

export default ProductViewPage;