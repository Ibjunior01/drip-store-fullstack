import Hero from "../components/home/Hero";
import FeaturedCollections from "../components/home/FeaturedCollections";
import TrendingProducts from "../components/home/TrendingProducts";

function HomePage() {
  return (
    <main>
      <Hero />

      <div className="home-container">
        <FeaturedCollections />
        <TrendingProducts />
      </div>
    </main>
  );
}

export default HomePage;