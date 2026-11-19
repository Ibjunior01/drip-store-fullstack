import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("filter") || "";

  const [brand, setBrand] = useState("Todas");
  const [sort, setSort] = useState("default");

  const brands = ["Todas", ...new Set(products.map(p => p.brand))];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesBrand =
        brand === "Todas" || product.brand === brand;

      const term = search.toLocaleLowerCase("pt-BR");

      const matchesSearch =
        `${product.name} ${product.brand} ${product.category}`
          .toLocaleLowerCase("pt-BR")
          .includes(term);

      return matchesBrand && matchesSearch;
    });

    if (sort === "lowest") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "highest") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [brand, search, sort]);

  return (
    <main className="catalog-page">
      <div className="catalog-heading">
        <div>
          <h1>Produtos</h1>
          <p>{filteredProducts.length} produtos encontrados</p>
        </div>

        <label>
          Ordenar por:{" "}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="default">Relevância</option>
            <option value="lowest">Menor preço</option>
            <option value="highest">Maior preço</option>
          </select>
        </label>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-filters">
          <h2>Filtrar por</h2>

          <fieldset>
            <legend>Marca</legend>

            {brands.map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="brand"
                  checked={brand === item}
                  onChange={() => setBrand(item)}
                />
                {item}
              </label>
            ))}
          </fieldset>
        </aside>

        <section aria-label="Resultados da busca">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductListingPage;