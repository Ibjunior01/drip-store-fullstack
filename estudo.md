- JavaScript: linguagem de programação que utilizaremos para desenvolver a aplicação.
- React: biblioteca JavaScript para construir interfaces por meio de *componentes reutilizáveis*.
- Vite: ferramenta que prepara o ambiente de desenvolvimento, inicia o servidor local e gera os arquivos para publicação.
- O código utiliza JSX, uma sintaxe que permite escrever elementos semelhantes a HTML dentro do JavaScript.

Arquivo	                Responsabilidade
package.json	        Dependências e scripts
index.html	            Documento HTML inicial
src/main.jsx	        Entrada da aplicação React
src/App.jsx	            Componente principal
src/App.css	            Estilos do componente App
src/index.css	        Estilos globais
vite.config.js	        Configuração do Vite

- function App(): declara um componente React.
- return (...): define a interface que o componente renderizará.
- export default App: permite que esse componente seja importado por outros arquivos.
- componentes personalizados devem começar com letra maiúscula, permitindo ao React diferenciá-los dos elementos HTML nativos (Ex. <Header /> React e <header> HTML)


<header>cabeçalho
<main>: conteúdo principal
<footer> Rodapé

<div>: contêiner genérico, sem significado semântico próprio. É muito utilizado para agrupar elementos e organizar layouts.
<section>: representa uma seção temática do documento, geralmente acompanhada de um título.

### CSS 
- Content: conteúdo do elemento.
- Padding: espaço interno, entre o conteúdo e a borda.
- Border: contorno do elemento.
- Margin: espaço externo, que separa o elemento dos demais.

- Flexbox é um sistema de layout do CSS que permite organizar elementos em linhas ou colunas, controlar alinhamentos e distribuir espaços.
* display: flex: ativa o Flexbox no elemento.
* align-items: center: centraliza os itens no eixo transversal, vertical quando a direção é uma linha.
* justify-content: space-between: distribui o espaço disponível entre os itens no eixo principal.

