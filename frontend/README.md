Estrutura Geral do Projeto

O projeto foi dividido em duas camadas principais — Backend e Frontend, cada uma com organização independente para facilitar a manutenção e escalabilidade.

Backend (Node.js + Express)

O backend segue o padrão arquitetural CSR (Controller–Service–Repository), com pastas separadas para cada responsabilidade.

backend/
│ package.json
│ package-lock.json
│ server.js
│
└───src/
    │
    ├── controllers/
    │     ├── bookController.js
    │     └── rentalController.js
    │
    ├── services/
    │     ├── bookService.js
    │     └── rentalService.js
    │
    ├── repositories/
    │     ├── bookRepository.js
    │     └── rentalRepository.js
    │
    ├── routes/
    │     ├── bookRoutes.js
    │     └── rentalRoutes.js
    │
    ├── data/
    │     ├── books.json
    │     └── rentals.json
    │
    └── middlewares/
          ├── logMiddleware.js
          ├── errorMiddleware.js
          └── validationMiddleware.js

Descrição geral

controllers/ → recebem requisições HTTP e chamam os services

services/ → contém lógica de negócio

repositories/ → realizam persistência em JSON

routes/ → expõem as APIs REST

middlewares/ → segurança, validação e log

data/ → banco de dados em arquivos JSON

Frontend (React)

O frontend utiliza React com estrutura organizada em camadas típicas do Create React App, com arquivos de interface e configuração separados.

frontend/
│ package.json
│ package-lock.json
│ README.md
│ relatorio.md
│
├───public/
│    ├── favicon.ico
│    ├── index.html
│    ├── logo192.png
│    ├── logo512.png
│    └── manifest.json
│
└───src/
     ├── App.css
     ├── App.js
     ├── App.test.js
     ├── index.js
     ├── index.css
     ├── logo.svg
     ├── reportWebVitals.js
     └── setupTests.js

Descrição geral

public/ contém arquivos estáticos e HTML principal

src/ contém a aplicação React, Hooks, estilos e renderização

index.js é o ponto de entrada do React

App.js contém a interface principal

O projeto foi organizado em duas camadas independentes — Backend e Frontend — permitindo uma arquitetura desacoplada e escalável. O Backend segue o padrão Controller-Service-Repository, enquanto o Frontend utiliza React com componentes separados e estilização modular. O uso de arquivos JSON simplificou a persistência e permitiu foco no desenvolvimento das lógicas de negócio e UI.

A. Root
locadora-livros/

-=- COMO INICIALIZAR -=-

Backend:
bash
cd backend
npm install
npm run dev
# Servidor rodando em http://localhost:3000

Frontend:
bash
cd frontend
npm install
npm start
# Aplicação rodando em http://localhost:3001

Durante o inicio da execução do projeto surgirão dos alertas que serão necessárias interação do usuário para poder dar sequencia no uso.

1. Após executar o comando "npm start", será necessário realizar uma confirmação de execução, pressione "Y" para prosseguir.
Print: https://prnt.sc/aJSPnAPvj1qp

2. Após acessar a página web, surgirá uma tela de erro do PostCSS, haverá um X no canto superior direito para fechar está mensagem.
Print: https://prnt.sc/GS36jOE991eQ

Após estas rápidas interações do usuário, a página estará totalmente funcional.

=-=-=-=-=

C. Endpoints da API Documentados

Livros:
GET /api/books - Lista todos os livros
GET /api/books?search=termo - Busca livros por termo
GET /api/books/:id - Busca livro específico
POST /api/books - Cria novo livro
PUT /api/books/:id - Atualiza livro
DELETE /api/books/:id - Remove livro

Imports:
POST /api/rentals - Cria novo aluguel
GET /api/rentals - Lista todos os aluguéis
GET /api/rentals/:id - Busca aluguel específico
D. Exemplos de Conventional Commits Utilizados
feat: implementa middleware de log de requisições
feat: adiciona Repository de livros com persistência JSON
feat: cria Service de livros com lógica de negócio
feat: implementa Controller de livros
feat: define rotas de livros (GET, POST, PUT, DELETE)
feat: adiciona sistema de carrinho de compras
feat: implementa painel administrativo
style: adiciona design responsivo com CSS puro
fix: corrige validação de email no frontend
docs: adiciona documentação completa da API

Documentação Oficial:

Node.js Documentation. Disponível em: https://nodejs.org/docs/
Express.js Guide. Disponível em: https://expressjs.com/
React Documentation. Disponível em: https://react.dev/
MDN Web Docs - JavaScript. Disponível em: https://developer.mozilla.org/
Conventional Commits:

Conventional Commits Specification. Disponível em: https://www.conventionalcommits.org/

Conceitos de Arquitetura:
MDN Web Docs - Responsive Design

Desenvolvido por Ryan Machado e Gabriel Tedesco
Universidade Comunitária da Região de Chapecó - UNOCHAPECÓ
Dezembro de 2025.