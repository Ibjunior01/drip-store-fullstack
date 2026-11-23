const collections = [
  {
    id: 1,
    image: "/collection-1.png",
    name: "Coleção Supreme",
  },
  {
    id: 2,
    image: "/collection-2.png",
    name: "Coleção Adidas",
  },
  {
    id: 3,
    image: "/collection-3.png",
    name: "Novo Beats Bass",
  },
];

function FeaturedCollections() {
  return (
    <section className="home-section">
      <h2>Coleções em destaque</h2>

      <div className="collections-grid">
        {collections.map((collection) => (
          <article
            className="collection-card"
            key={collection.id}
          >
            <img
              src={collection.image}
              alt={collection.name}
            />

            <a href="/products" className="collection-link">
              Comprar
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollections;