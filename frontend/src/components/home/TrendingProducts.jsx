import { Link } from "react-router";
import { products } from "../../data/products";
import ProductCard from "../products/ProductCard";

function TrendingProducts() {
  return (
    <section className="home-section">
      <div className="section-heading">
        <h2>Produtos em alta</h2>
        <Link to="/products">Ver todos</Link>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default TrendingProducts;