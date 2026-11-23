import { useState } from "react";

const slides = [
  "/home-slide-7.jpeg",
  "/home-slide-8.jpeg",
  "/home-slide-3.jpeg",
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-label">
            Melhores ofertas personalizadas
          </span>

          <h1>Queima de estoque Nike 🔥</h1>

          <p>
            Confira nossa seleção de produtos e aproveite
            ofertas especiais para renovar seu estilo.
          </p>

          <a href="/products" className="primary-button">
            Ver Ofertas
          </a>
        </div>

        <div className="hero-image">
          <img
            src={slides[activeSlide]}
            alt="Tênis da campanha promocional"
          />
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide}
            type="button"
            aria-label={`Mostrar imagem ${index + 1}`}
            aria-pressed={activeSlide === index}
            className={activeSlide === index ? "active" : ""}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;