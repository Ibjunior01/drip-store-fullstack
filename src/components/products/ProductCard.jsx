import { Link } from "react-router";
import { formatPrice } from "../../data/products";
import "./ProductCard.css";

function ProductCard({ product }) {
  const discount = Math.round(
    (1 - product.price / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-link"
      >
        <div className="product-image">
          <span className="product-discount">
            {discount}% OFF
          </span>

          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <span>{product.category}</span>
          <h3>{product.name}</h3>

          <div className="product-prices">
            <s>{formatPrice(product.oldPrice)}</s>
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;