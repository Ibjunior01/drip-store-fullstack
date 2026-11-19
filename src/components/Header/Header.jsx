import "./Header.css";
import { Link, NavLink } from "react-router";


function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-top">
          <Link to="/" className="header-logo">
            <img src="/logo-header.svg" alt="Digital Store" />
          </Link>

          <form
            className="header-search"
            action="/products"
            method="get"
            role="search"
          >
            <input
              type="search"
              name="filter"
              placeholder="Pesquisar produto..."
              aria-label="Pesquisar produto"
            />

            <button type="submit" aria-label="Buscar">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 5 5" />
              </svg>
            </button>
          </form>

          <div className="header-actions">
            <a href="#cadastro" className="register">
              Cadastre-se
            </a>

            <a href="#entrar" className="login">
              Entrar
            </a>

            <img
              src="/mini-cart.svg"
              alt="Carrinho"
              className="cart"
            />
          </div>
        </div>

        <nav className="header-nav" aria-label="Menu principal">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
            Produtos
          </NavLink>
          <a href="/#categorias">Categorias</a>
          <a href="#pedidos">Meus Pedidos</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;