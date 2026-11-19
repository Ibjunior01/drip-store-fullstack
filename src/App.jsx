import { Routes, Route } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductViewPage from "./pages/ProductViewPage";

import "./App.css";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductViewPage />} />
        <Route
          path="*"
          element={
            <main className="catalog-page">
              <h1>Página não encontrada</h1>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;