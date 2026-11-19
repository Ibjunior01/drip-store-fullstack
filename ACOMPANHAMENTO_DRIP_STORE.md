Drip Store — Diário de desenvolvimento e roadmap
Projeto: Drip Store — Digital College
Tipo: Mentoria prática Full Stack
Ambiente: macOS Monterey 12.7.6 (Intel x86_64), VS Code
Última atualização: 05/11/2026
Fase atual: Fundamentos de React concluídos; preparação para estilizar o Header conforme o Figma.
1. Objetivo
Construir uma loja virtual inspirada no design da Drip Store, começando pelo frontend em React e evoluindo para uma aplicação Full Stack. A meta da mentoria é dominar fundamentos, desenvolver autonomia, praticar depuração e adotar boas práticas de estruturação, versionamento, testes e segurança.
2. Referências
- Figma: https://www.figma.com/design/nUk0ihM3x4u8JQtxUoAEJf/DRIP-STORE---DIGITAL-COLLEGE--Copy-?node-id=22-30
- Repositório-base: arquivos README.md, assets/, doc/ e public/ extraídos do material do projeto.
- Páginas identificadas na captura: Home, listagem de produtos e detalhes de produto; versões desktop e mobile, incluindo estados de menu e busca.
A captura permite entender a estrutura visual, mas ainda será necessário consultar medidas, tipografia e outros detalhes para reprodução fiel ao Figma.

3. Ambiente validado
Ferramenta	Estado
macOS Monterey 12.7.6, Intel x86_64	Identificado
VS Code	Em uso
Node.js 22.23.3	Funcionando
npm 10.9.9	Funcionando
Git 2.37.1 (Apple Git)	Funcionando
React + Vite	Aplicação executada em http://localhost:5173/


Diretório local utilizado: /Users/setorbi/Downloads/projeto-digital-store-main.
4. Histórico da mentoria
Aula	Conteúdo	Situação
01	Configuração do Mac e solução da incompatibilidade do Node.js	Concluída
02	Inicialização da aplicação React usando Vite	Concluída
03	JSX, App.jsx, HTML semântico e uso de <section>	Concluída
04	Criação, exportação, importação e renderização de Header e Footer	Concluída
05	CSS global, Box Model, border-box, margin: auto e introdução ao Flexbox	Em andamento / fundamentos abordados


O que já foi implementado
- Projeto React inicializado com Vite e executado localmente.
- src/App.jsx com Header, conteúdo principal dividido em duas seções e Footer.
- src/components/Header/Header.jsx: cabeçalho inicial com nome e subtítulo da loja.
- src/components/Footer/Footer.jsx: rodapé com direitos reservados.
- src/App.css: classes de largura/alinhamento do conteúdo e Flexbox para o cabeçalho, conforme os últimos exercícios.
- src/index.css: proposta de base CSS limpa, removendo estilos globais que interferiam no layout; confirmar que a última versão foi salva no projeto antes do commit.
Problemas resolvidos e lições
- Node.js incompatível com o macOS Monterey: instalado Node.js 22.23.3 compatível.
- Erro de importação default do Footer: aplicação voltou a executar após revisão e reinício do Vite; causa exata não foi isolada.
- Diferença entre elemento HTML <footer> e componente React <Footer />.
- Identificação de CSS ativo com fundo de teste no .cabecalho.
- Revisão de className, semântica HTML e dimensionamento com box-sizing: border-box.
5. Estrutura atual esperada
projeto-digital-store-main/
├── assets/
├── doc/
├── public/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   └── Footer/
│   │       └── Footer.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
A estrutura deve ser conferida com os arquivos reais antes da publicação.
6. Próxima atividade imediata
Aula 06 — Header orientado pelo Figma
1. Confirmar o conteúdo final salvo em src/index.css e src/App.css.
2. Criar src/components/Header/Header.css e importá-lo em Header.jsx.
3. Migrar do App.css para Header.css apenas as regras específicas do Header.
4. Construir gradualmente logo, busca, navegação, ações e carrinho, seguindo o design.
5. Testar em desktop e mobile e revisar acessibilidade básica.
Importante: a Aula 06 ainda não foi iniciada.
7. Roadmap de evolução
Fase A — Frontend base
- [x] Configurar ambiente e iniciar React + Vite.
- [x] Criar componentes Header e Footer.
- [x] Praticar JSX, HTML semântico e CSS básico.
- [ ] Implementar Header responsivo conforme o Figma.
- [ ] Criar Footer estilizado conforme o Figma.
- [ ] Implementar a Home (banner, coleções, destaques e cards).
- [ ] Implementar listagem de produtos, filtros e ordenação.
- [ ] Implementar detalhes de produto, opções e galeria.
- [ ] Implementar navegação entre páginas e estados responsivos.
Fase B — Backend e dados (arquitetura a definir)
- [ ] Definir requisitos funcionais e entidades de negócio.
- [ ] Escolher stack de API e banco de dados.
- [ ] Criar API de produtos e categorias com validações.
- [ ] Implementar persistência e tratamento de erros.
- [ ] Planejar autenticação e autorização caso sejam necessárias.
Fase C — Integração e funcionalidades
- [ ] Integrar frontend à API.
- [ ] Implementar carrinho e fluxo de pedidos de demonstração.
- [ ] Tratar estados de carregamento, vazio e erro.
Fase D — Qualidade e entrega
- [ ] Criar testes e validações automatizadas.
- [ ] Revisar acessibilidade, responsividade e segurança.
- [ ] Documentar configuração e execução.
- [ ] Realizar deploy do frontend e da API.
Roadmap sujeito a refinamento conforme evolução técnica e requisitos do projeto. Pagamentos reais não fazem parte do escopo inicial.

8. Método de mentoria
- Trabalhar uma etapa por vez: explicação, exercício, implementação e revisão.
- Informar sempre pasta e nome do arquivo antes de orientar alterações.
- Incentivar implementação própria antes de oferecer a solução completa.
- Confirmar o funcionamento no navegador e no terminal antes de avançar.
- Registrar o progresso e versionar mudanças pequenas e verificadas no Git.
9. Registro de versão
Data	Marco	Git
05/11/2026	Base React, Header/Footer, CSS inicial e registro de progresso	Commit inicial a realizar


10. Próxima revisão deste documento
Atualizar após a conclusão do Header responsivo e antes de iniciar a Home completa.