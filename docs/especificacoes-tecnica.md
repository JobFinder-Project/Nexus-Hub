### Documento de Especificação Técnica: Nexus-Hub

#### 1\. Visão Geral da Arquitetura

A aplicação será construída seguindo uma arquitetura **MVC (Model-View-Controller)**, que se integra bem com o stack escolhido.

  * **Model:** Representará a estrutura dos dados (tabelas do banco de dados) e a lógica de negócio. Será gerenciado por um ORM (Object-Relational Mapper) como o **Sequelize** ou **Prisma** para interagir com o banco de dados SQL de forma segura e produtiva.
  * **View:** Será renderizada no lado do servidor (Server-Side Rendering) usando o **Handlebars.js**. O Handlebars será responsável por exibir dinamicamente os dados fornecidos pelos Controllers nos templates HTML.
  * **Controller:** Será implementado usando o **Express.js** (framework para Node.js). Os controllers receberão as requisições HTTP (vindas da interação do usuário com a View), processarão a lógica necessária (consultando os Models) e enviarão os dados para a View correspondente renderizar.

**Fluxo da Requisição:**

1.  O usuário acessa uma URL no navegador.
2.  O Express.js captura a requisição e a direciona para a rota correspondente no Controller.
3.  O Controller interage com os Models para buscar ou manipular dados no banco de dados.
4.  O Controller passa os dados obtidos para um template Handlebars.
5.  O Handlebars gera a página HTML final, que é enviada de volta ao navegador do usuário.

#### 2\. Design do Banco de Dados (Schema SQL)

A seguir, uma estrutura atualizada para as tabelas do banco de dados relacional, baseada nas histórias de usuário e regras de negócio.

<img width="1209" height="939" alt="image" src="https://github.com/user-attachments/assets/3c2d4576-441b-4591-807c-7cca9ee47fcc" />

A estrutura de tabelas reflete as necessidades do marketplace, incluindo a nova estrutura modular para Requisitos e Imagens, e os novos campos de categorização (`tipo`, `desenvolvedor`, `sistema`, `data_lancamento`).

### Estrutura do Banco de Dados Atual (Schema SQL)

| Tabela | Colunas (Campos Chave e FKs) | Observações |
| :--- | :--- | :--- |
| **usuarios** | `id` (PK), `email`, `senha_hash`, `perfil`, `data_nascimento` | Tabela base para autenticação (Cliente, Parceiro, Admin). |
| **plataformas** | `id` (PK), `nome`, `slug` | Plataformas de destino (Ex: PC, PlayStation, macOS). |
| **generos** | `id` (PK), `nome`, `slug` | Categorias temáticas (Ex: Ação, RPG, Simulação). |
| **requisitos** | `id` (PK), `produto_id` (FK, UNIQUE), `os`, `processador`, `memoria`, `graficos`, `armazenamento` | Detalhes estruturados dos requisitos de sistema. Relação **1:1** com `produtos`. |
| **imagens_galeria** | `id` (PK), `produto_id` (FK), `url`, `descricao` | URLs para screenshots e galeria. Relação **1:N** com `produtos`. |
| **promocoes** | `id` (PK), `produto_id` (FK, UNIQUE), `percentual_desconto`, `data_inicio`, `data_fim`, `esta_ativo` | Gestão do preço promocional e validade. Relação **1:1** (ativa) com `produtos`. |
| **produtos** | `id` (PK), `parceiro_id` (FK), `plataforma_id` (FK), **`tipo`**, **`sistema`**, **`data_lancamento`**, **`desenvolvedor`**, `titulo`, `slug`, `descricao`, `preco`, `classificacao_etaria`, **`cover`**, `requisitos_id` (FK), `status` | O item vendido. Contém todas as chaves estrangeiras e novos campos de categorização. |
| **produto_generos** | `produto_id` (FK), `genero_id` (FK) | Tabela de associação (N:M) entre `produtos` e `generos`. |
| **chaves_produto** | `id` (PK), `produto_id` (FK), `item_compra_id` (FK, UNIQUE), `valor_chave`, `foi_vendida` | O inventário de chaves. Relação **1:1** com `itens_compra`. |
| **compras** | `id` (PK), `cliente_id` (FK), `preco_total`, `status_pagamento` | O pedido principal. Relação **1:N** com `itens_compra`. |
| **itens_compra** | `id` (PK), `compra_id` (FK), `produto_id` (FK), `preco_na_compra`, `chave_revelada_em` | Detalhe dos produtos comprados no pedido. Liga a chave de ativação à transação (via `chaves_produto`). |

### Relacionamentos das Tabelas Principais

Os relacionamentos garantem a integridade dos dados e definem a lógica de negócio do marketplace:

* **Relação Usuário e Conteúdo (1:N):**
    * Um `usuario` (Parceiro) pode submeter **muitos** `produtos`.
    * Um `usuario` (Cliente) pode realizar **muitas** `compras`.

* **Relação Categoria e Catálogo (1:N e N:M):**
    * Uma `plataforma` pode ter **muitos** `produtos`.
    * Um `produto` tem **muitas** `promocoes` registradas (apenas uma ativa).
    * Um `produto` tem **muitas** `imagens_galeria` (screenshots).
    * Um `produto` tem **muitos** `generos`, e um `genero` se aplica a **muitos** `produtos` (resolvido por `produto_generos`).

* **Relação de Detalhamento Estruturado (1:1):**
    * Um `produto` está ligado a **um único** registro de `requisitos` (detalhes técnicos).

* **Relação Transacional (1:N e 1:1):**
    * Uma `compra` é composta por **muitos** `itens_compra`.
    * Cada `item_compra` está vinculado a **um único** `produto`.
    * Cada `item_compra` (unidade vendida) está estritamente ligado a **uma única** `chaves_produto` (chave de ativação), que é a alocação do inventário.

#### 3\. Definição das Rotas e Controllers (API Endpoints)

Aqui definimos as principais rotas da aplicação que serão gerenciadas pelo Express.js.

  * **Rotas de Autenticação (`authController.js`)**

      * `GET /login`: Renderiza a página de login.
      * `POST /login`: Processa a tentativa de login.
      * `GET /register`: Renderiza a página de cadastro.
      * `POST /register`: Processa o cadastro de um novo usuário.
      * `GET /logout`: Desloga o usuário.

  * **Rotas Públicas e da Loja (`catalogController.js`)**

      * `GET /`: Renderiza a página inicial com banners e produtos em destaque.
      * `GET /catalog`: Renderiza a página principal do catálogo com todos os produtos e filtros visíveis. .
      * `GET /catalog/platform/:platformSlug`: Filtra o catálogo por plataforma (ex: `/catalog/platform/pc`, `/catalog/platform/playstation`).
      * `GET /catalog/genre/:genreSlug`: Filtra o catálogo por gênero (ex: `/catalog/genre/acao`).
      * `GET /product/:productSlug`: Renderiza a página de detalhes de um produto específico (ex: `/product/cyberpunk-2077`). Usar um "slug" (texto amigável) é melhor que um ID numérico.


  * **Rotas do Cliente (`clientController.js`)** - *Requer autenticação*

      * `GET /cart`: Renderiza o carrinho de compras.
      * `POST /cart/add/:productId`: Adiciona um item ao carrinho (US06).
      * `POST /cart/remove/:productId`: Remove um item do carrinho (US06).
      * `GET /checkout`: Renderiza a página de checkout (US07).
      * `POST /checkout`: Processa a compra (US07).
      * `GET /library`: Mostra a biblioteca de jogos do cliente (US09).
      * `GET /library/keys/:purchaseId`: Exibe a chave de um produto comprado (US10).

  * **Rotas do Parceiro (`partnerController.js`)** - *Requer autenticação e role 'partner'*

      * `GET /partner/dashboard`: Painel do parceiro com métricas (US17).
      * `GET /partner/products`: Lista os produtos do parceiro.
      * `GET /partner/products/new`: Formulário para submeter novo produto (US11).
      * `POST /partner/products/new`: Processa a submissão.
      * `GET /partner/products/edit/:id`: Formulário para editar um produto (US13).
      * `POST /partner/products/edit/:id`: Processa a edição.
      * `POST /partner/products/:id/keys`: Faz upload de chaves (US12).

  * **Rotas do Administrador (`adminController.js`)** - *Requer autenticação e role 'admin'*

      * `GET /admin/dashboard`: Painel geral da plataforma (US24).
      * `GET /admin/approvals`: Lista de produtos pendentes de aprovação (US18).
      * `POST /admin/approvals/:id/approve`: Aprova um produto (US19).
      * `POST /admin/approvals/:id/reject`: Rejeita um produto (US19).
      * `GET /admin/users`: Gerenciamento de usuários (US23).

#### 4\. Estrutura de Pastas do Projeto

```
/nexus-hub
|-- .env                  # Variáveis de ambiente (chaves de API, credenciais do DB)
|-- .gitignore            # Arquivos e pastas a serem ignorados pelo Git
|-- package.json          # Dependências e scripts do projeto
|-- server.js             # Ponto de entrada: inicializa o servidor Express e as rotas
|
|-- /src
|   |-- app.js
|   |-- /config           # Configurações
|   |   |-- database.js   # Configuração da conexão com o banco de dados (Sequelize/Prisma)
|   |   |-- session.js    # Configuração de sessões de usuário
|   |
|   |-- /controllers      # Lógica de negócio que conecta rotas e modelos
|   |   |-- authController.js       # Controla login, registro, logout
|   |   |-- catalogController.js    # Controla a visualização da loja, produtos
|   |   |-- userController.js       # Controla carrinho, biblioteca, checkout
|   |   |-- partnerController.js    # Controla o painel do parceiro
|   |   |-- adminController.js      # Controla o painel do administrador
|   |
|   |-- /helpers          # Funções auxiliares para Handlebars e outros módulos
|   |   |-- handlebars-helpers.js # Ex: formatar_preco, formatar_data
|   |
|   |-- /middlewares      # Funções que rodam entre a requisição e o controller
|   |   |-- authMiddleware.js # Funções como isAuthenticated (verifica se está logado)
|   |   |-- roleMiddleware.js # Funções como isPartner, isAdmin (verifica o papel)
|   |
|   |-- /models           # Definição das tabelas do banco de dados (Schema)
|   |   |-- User.js
|   |   |-- Product.js
|   |   |-- ProductKey.js
|   |   |-- Purchase.js
|   |   |-- Platform.js
|   |   |-- index.js        # Configura as associações entre os modelos (ex: User has many Purchases)
|   |
|   |-- /public           # Arquivos estáticos acessíveis publicamente
|   |   |-- /css          # Folhas de estilo (style.css)
|   |   |-- /img          # Imagens, logos, banners
|   |   |-- /js           # Scripts do lado do cliente (ex: validação de formulário em tempo real)
|   |
|   |-- /routes           # Definição das rotas da aplicação
|   |   |-- auth.routes.js        # Rotas de /login, /register
|   |   |-- catalog.routes.js     # Rotas de /, /catalog, /product/:slug
|   |   |-- user.routes.js        # Rotas de /cart, /library, /checkout
|   |   |-- partner.routes.js     # Rotas prefixadas com /partner
|   |   |-- admin.routes.js       # Rotas prefixadas com /admin
|   |   |-- index.js              # Arquivo principal que agrega e exporta todas as rotas
|   |
|   |-- /services         # Lógica para se comunicar com serviços externos
|   |   |-- paymentService.js     # Lógica para interagir com a API de pagamento
|   |   |-- emailService.js       # Lógica para enviar e-mails (confirmação de compra, etc.)
|   |
|   |-- /views            # Arquivos de template .handlebars
|       |-- /auth         # Telas de autenticação
|       |   |-- login.handlebars
|       |   |-- register.handlebars
|       |
|       |-- /catalog      # Telas da loja pública
|       |   |-- index.handlebars
|       |   |-- product.handlebars
|       |
|       |-- /user         # Painel e telas do cliente logado
|       |   |-- cart.handlebars
|       |   |-- checkout.handlebars
|       |   |-- library.handlebars
|       |
|       |-- /dashboard    # PASTA UNIFICADA para os painéis de Admin e Parceiro
|       |   |-- dashboard.handlebars     # A página principal do painel, que renderiza widgets diferentes por role
|       |   |-- product-list.handlebars  # Lista de produtos (para o parceiro ver os seus, para o admin ver todos/pendentes)
|       |   |-- product-form.handlebars  # Formulário único para criar/editar produtos
|       |   |-- user-list.handlebars     # Apenas para o admin gerenciar usuários
|       |
|       |-- /layouts
|       |   |-- main.handlebars          # Layout principal para a loja e áreas de cliente
|       |   |-- dashboard.handlebars     # Layout unificado para as páginas da pasta /dashboard
|       |   |-- auth.handlebars          # Layout para login e criação de conta
|       |
|       |-- /partials
|           |-- /widgets                 # Componentes específicos dos dashboards
|           |   |-- widget-sales-summary.handlebars
|           |   |-- widget-pending-approvals.handlebars
|           |   |-- widget-user-count.handlebars
|           |
|           |-- header.handlebars
|           |-- footer.handlebars
|           |-- product-card.handlebars
|           |-- dashboard-sidebar.handlebars # A barra lateral que mostrará links diferentes com base no role
```

