Drip Store — Digital College
Projeto de loja virtual desenvolvido com React, Vite e React Router, com interface baseada no desafio Drip Store — Digital College e nas telas de referência do Figma.
Escopo desta entrega: frontend demonstrativo. O catálogo é armazenado localmente em JavaScript; não há backend, autenticação, checkout ou processamento de pagamentos. O botão Comprar valida e confirma visualmente a seleção de opções, mas não finaliza uma compra.

Referências
- Design no Figma
- [Especificações originais do desafio](./README_REQUISITOS_ORIGINAIS.md) — cópia do README fornecido com o material-base (caso seja adicionada à raiz deste repositório).
- doc/layout/ — imagens de referência do material original, quando presentes.
Funcionalidades implementadas
Área	Funcionalidades	Situação
Cabeçalho	Logo, navegação, campo de busca e elementos visuais de acesso/carrinho	Implementação inicial; alguns links ainda demonstrativos
Home (/)	Banner com troca manual de imagens, coleções em destaque e produtos em alta	Implementada; fidelidade final ao Figma não auditada
Listagem (/products)	Cards reutilizáveis, busca por termo, filtro de marca e ordenação por preço	Implementada com catálogo local
Detalhes (/products/:id)	Galeria de imagens, seleção de tamanho e cor, validação do botão Comprar, recomendados	Implementada em caráter demonstrativo
Responsividade	Adaptações por media queries	Implementação inicial; revisão visual em diferentes telas recomendada


Observações: os nomes e preços dos produtos usados no catálogo são demonstrativos. As miniaturas da página de detalhes são recursos de exemplo e podem não corresponder ao mesmo modelo exibido. Os links de cadastro, login, pedidos e algumas âncoras não representam fluxos completos.
Tecnologias
- React — construção dos componentes e gerenciamento de estado (useState).
- React Router — navegação entre páginas e parâmetros dinâmicos.
- Vite — servidor de desenvolvimento e build de produção.
- CSS — estilos e responsividade.
- JavaScript (JSX) — lógica e componentes da aplicação.
- ESLint — análise estática do código.
Requisitos para execução
- Node.js e npm instalados.
- Ambiente validado durante o desenvolvimento: Node.js 22.23.3, npm 10.9.9, macOS Monterey 12.7.6 (Intel).
Instalação e execução
No terminal, abra a pasta do projeto e execute:
npm install
npm run dev
Acesse o endereço apresentado pelo Vite, normalmente http://localhost:5173/.
Build de produção
npm run build
npm run preview
O build gera a pasta dist/. O comando preview permite testar localmente a versão compilada, normalmente em http://localhost:4173/.
Análise estática
npm run lint
Validação registrada em 19/11/2026: npm run build finalizou com sucesso (35 módulos transformados) e npm run lint terminou sem erros reportados. Esses testes não substituem uma validação funcional completa em navegadores e tamanhos de tela diferentes.
Estrutura do projeto
projeto-digital-store-main/
├── assets/                        # Recursos fornecidos com o desafio
├── doc/                           # Referências de layout
├── public/                        # Imagens e ícones servidos estaticamente
├── src/
│   ├── components/
│   │   ├── Footer/
│   │   │   └── Footer.jsx
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedCollections.jsx
│   │   │   └── TrendingProducts.jsx
│   │   └── products/
│   │       ├── ProductCard.jsx
│   │       └── ProductCard.css
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductListingPage.jsx
│   │   ├── ProductViewPage.jsx
│   │   └── ProductViewPage.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
├── README_REQUISITOS_ORIGINAIS.md    # Adicionar junto com este README
└── README.md
node_modules/ e dist/ não devem ser versionadas. A estrutura acima reflete os arquivos trabalhados durante a mentoria; confira a árvore real antes do commit.
Rotas e interação
Rota	Descrição
/	Página inicial
/products	Catálogo com filtros e ordenação
/products?filter=nike	Busca por termo enviado pelo campo do cabeçalho
/products/1	Detalhes de produto (identificador dinâmico)


Os dados do catálogo estão em src/data/products.js e são consumidos por TrendingProducts, ProductListingPage, ProductViewPage e ProductCard.
Como testar manualmente
1. Abrir a Home e alternar as imagens do banner.
2. Navegar até Produtos e conferir os cards.
3. Pesquisar um termo pelo campo de busca do cabeçalho.
4. Aplicar filtro de marca e ordenar por menor/maior preço.
5. Abrir um card, trocar a imagem e selecionar tamanho e cor.
6. Clicar em Comprar sem opções (deve solicitar seleção) e depois com opções (deve confirmar a seleção).
7. Validar navegação, carregamento de imagens e layout em desktop e mobile.
8. Executar npm run build e npm run lint.
Limitações e próximos passos
- Comparar as três páginas em detalhe com o Figma e corrigir divergências de tipografia, espaçamento e responsividade.
- Completar os componentes e elementos exigidos no README original que ainda não estejam implementados.
- Substituir dados demonstrativos por um catálogo definitivo, com imagens correspondentes a cada produto.
- Implementar rotas reais para acesso, cadastro, pedidos e carrinho somente se estiverem no escopo da entrega.
- Publicar o código no GitHub; o primeiro envio remoto apresentou falhas de conexão, apesar de o commit local ter sido criado.

Histórico do desenvolvimento
O projeto foi realizado em formato de mentoria prática, com revisão de JSX, componentes, props, estado, eventos, Flexbox, rotas e testes. Um registro complementar pode ser mantido em ACOMPANHAMENTO_DRIP_STORE.md.

