import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";


function App() {
  return (
    <div>
      <Header />
      
      <main className="conteudo-principal">
        <section>
          <h2>Bem-vindo à Drip Store</h2>
          <p>Encontre os melhores produtos aqui!</p>
        </section>

        <section>
          <h2>Produtos em destaque</h2>
          <p>Confira nossas ofertas especiais</p>
        </section>
      </main>

      <Footer />
        
    </div>
  );
}

export default App;