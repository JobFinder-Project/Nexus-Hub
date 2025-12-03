# Taks 1 realizada:
---
## 📋 Descrição

Traduzir todo o *schema* SQL do `nexus_hub` para *Models* do Sequelize. Esta tarefa envolve a criação de um arquivo JavaScript para cada tabela (ex: `Usuario.js`, `Produto.js`) dentro da pasta `src/models/`. Além de definir todas as colunas com os `DataTypes` corretos, é essencial implementar todas as associações (relacionamentos) entre os *models* (ex: `belongsTo`, `hasMany`, `belongsToMany`).

## ❗ Problema

Embora a aplicação consiga *conectar-se* ao banco de dados (Task 01.3 e 01.4), ela ainda não tem "consciência" da estrutura dos dados. Sem os *Models* do Sequelize definidos, é impossível para a aplicação realizar operações de CRUD (Consultar, Criar, Atualizar, Deletar) de forma abstraída (ORM), que é o principal benefício de usar o Sequelize.

## 🎯 Objetivo 

1.  **Criação dos Arquivos de Model:**
    - [x] Criar a pasta `src/models/`.
    - [x] Criar os arquivos de *model* para cada tabela:
        - [x] `Usuario.js` (para `usuarios`)
        - [x] `Plataforma.js` (para `plataformas`)
        - [x] `Genero.js` (para `generos`)
        - [x] `Produto.js` (para `produtos`)
        - [x] `Compra.js` (para `compras`)
        - [x] `ItemCompra.js` (para `itens_compra`)
        - [x] `ChaveProduto.js` (para `chaves_produto`)
        - [x] `Promocao.js` (para `promocoes`)
    - [x] Mapear todas as colunas do SQL para os `DataTypes` corretos do Sequelize em cada *model* (ex: `VARCHAR` -> `DataTypes.STRING`, `DECIMAL` -> `DataTypes.DECIMAL`, `TIMESTAMP` -> `DataTypes.DATE`).
    - [x] Configurar os *models* para usar os nomes de `timestamps` customizados (`createdAt: 'criado_em'`, `updatedAt: 'atualizado_em'`).

2.  **Implementação das Associações (Relacionamentos):**
    - [x] Criar um arquivo `src/models/index.js` que importa a instância do `sequelize` (do config) e todos os *models* criados.
    - [x] Dentro do `index.js`, definir todas as associações (FKs) entre os *models*:
    - [x] **Usuario <-> Produto** (Parceiro): `Usuario.hasMany(Produto)` e `Produto.belongsTo(Usuario, { foreignKey: 'parceiro_id' })`.
    - [x] **Plataforma <-> Produto**: `Plataforma.hasMany(Produto)` e `Produto.belongsTo(Plataforma, { foreignKey: 'plataforma_id' })`.
    - [x] **Usuario <-> Compra** (Cliente): `Usuario.hasMany(Compra)` e `Compra.belongsTo(Usuario, { foreignKey: 'cliente_id' })`.
    - [x] **Compra <-> ItemCompra**: `Compra.hasMany(ItemCompra)` e `ItemCompra.belongsTo(Compra, { foreignKey: 'compra_id' })`.
    - [x] **Produto <-> ItemCompra**: `Produto.hasMany(ItemCompra)` e `ItemCompra.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    - [x] **Produto <-> ChaveProduto**: `Produto.hasMany(ChaveProduto)` e `ChaveProduto.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    * [x] **ItemCompra <-> ChaveProduto** (1:1): `ItemCompra.hasOne(ChaveProduto)` e `ChaveProduto.belongsTo(ItemCompra, { foreignKey: 'item_compra_id' })`.
    - [x] **Produto <-> Promocao** (1:1): `Produto.hasOne(Promocao)` e `Promocao.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    - [x] **Produto <-> Genero** (N:M): `Produto.belongsToMany(Genero, { through: 'produto_generos' })` e `Genero.belongsToMany(Produto, { through: 'produto_generos' })`.
    - [x] Exportar todos os *models* e a instância do `sequelize` a partir do `index.js` para o restante da aplicação.

# Relatório da task

## ✅ Relatório de Teste

A task de criação do esqueleto e da estrutura inicial foi concluída e aprovada. O projeto agora possui uma base sólida e organizada (Arquitetura MVC) conforme as especificações iniciais.

Embora a task esteja aprovada, sugere-se uma pequena adição de dependências para agilizar o desenvolvimento dos fluxos de autenticação:

Sessão e Autenticação: Recomenda-se instalar as seguintes dependências que serão necessárias para gerenciar o estado do usuário e a segurança:

- `express-session`: Essencial para gerenciar as sessões de usuário.

- `bcrypt `: Crucial para o hashing seguro de senhas de usuários antes de serem armazenadas no banco de dados.

O código base está pronto para o desenvolvimento das funcionalidades do Roadmap v1.0.0.

---
# Taks 2 realizada:
---

## 📋 Descrição

Esta tarefa inicial foca em estabelecer a estrutura base e as boas práticas do repositório Git para o projeto Nexus-Hub. O objetivo é criar um ambiente organizado para o versionamento, definindo documentos essenciais de governança (LICENSE, README) e criando templates que padronizam a forma como as contribuições e problemas são reportados (Issues e Pull Requests).

## ❗ Problema

Atualmente, o projeto Nexus-Hub não possui um repositório Git estruturado. A ausência de um `README.md` descritivo, uma `LICENSE` (que define as regras de uso e distribuição) e templates de contribuição (Issues/PRs) impede o versionamento adequado, dificulta a colaboração e a entrada de novos membros, e não estabelece um padrão para relatar bugs ou sugerir funcionalidades.

## 🎯 Objetivo

- [x] Criar o arquivo `LICENSE`.
- [x] Criar o arquivo `README.md` contendo:
    - Título do projeto (Nexus-Hub).
    - Breve descrição do projeto.
    - Seção "Autores" (listando os membros da equipe).
- [x] Criar a pasta `.github/`.
- [x] Criar a subpasta `.github/ISSUE_TEMPLATE/`.
- [x] Adicionar os templates de Issue dentro da pasta `ISSUE_TEMPLATE/`:
    - [x] Template para `bug_report.md` (Bugfix).
    - [x] Template para `feature_request.md` (Nova Feature).
    - [x] Template para `upgrade.md` (Upgrade/Melhoria).
- [x] Criar o arquivo de template de Pull Request (`.github/PULL_REQUEST_TEMPLATE.md`).

# Relatório da task
## 📄 Relatório de Teste - ✅ Aprovado

A task foi **concluída** e **aprovada**. O projeto agora possui a estrutura de governança de código e documentação padronizada, essencial para a colaboração e entrada de novos membros. O repositório está estruturado e pronto para receber contribuições de forma organizada e eficiente.

---
# Taks 3 realizada:
---

## 📋 Descrição

Esta tarefa consiste em criar o arquivo `.env.example`, que servirá como o "contrato" de configuração para o ambiente de desenvolvimento do Nexus-Hub. Este arquivo deve listar todas as variáveis de ambiente necessárias para que a aplicação funcione corretamente, incluindo acessos ao banco de dados, configuração do servidor e segredos de sessão.

## ❗ Problema

Sem um `.env.example`, desenvolvedores que entram no projeto (incluindo os atuais em novas máquinas) não têm um guia claro de quais variáveis de ambiente são necessárias. Isso leva a erros de execução, dificuldade na configuração inicial (setup) e inconsistências entre os ambientes de desenvolvimento. É crucial padronizar essas configurações.

## 🎯 Objetivo 

- [x] Criar o arquivo `.env.example` na pasta raiz do projeto.
- [x] Adicionar as seguintes variáveis ao arquivo:
    - `PORT`
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME` (Necessária para a conexão com o banco)
    - `SESSION_SECRET`
- [x] Adicionar valores de exemplo genéricos e não sensíveis (ex: `PORT=8080`, `DB_USER=root`, `DB_HOST=localhost`).
- [x] Adicionar comentários de documentação (`#`) acima de cada variável, explicando sua finalidade (ex: `# Chave secreta para assinatura das sessões`).


# Relatório da task

## 📝 Relatório de Testes - ✅ Aprovado

A task foi validada com sucesso. A criação do arquivo de configuração de exemplo foi realizada perfeitamente, atendendo a todos os objetivos de padronização do ambiente de desenvolvimento.

1.  **Arquivo Criado:** O arquivo `.env.example` foi criado corretamente na raiz do projeto.
2.  **Completude das Variáveis:** Todas as variáveis de ambiente solicitadas (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` e `SESSION_SECRET`) foram incluídas no arquivo.
3.  **Valores de Exemplo Seguros:** As variáveis foram preenchidas com valores genéricos e placeholders (ex: `your_password`, `localhost`), garantindo que nenhum dado sensível real fosse exposto.
4.  **Documentação Clara:** Foram adicionados comentários (`#`) explicativos acima de cada variável ou grupo de variáveis, facilitando o entendimento da finalidade de cada configuração para novos desenvolvedores.


---
# Taks 4 realizada:
---
## 📋 Descrição

Estabelecer a conexão do projeto com um **banco de dados MySQL em nuvem** usando o ORM Sequelize. A implementação deve garantir que todos os desenvolvedores se conectem à mesma instância em nuvem, eliminando a necessidade de banco de dados local. Isso envolve instalar o Sequelize e o driver MySQL, além de configurar um arquivo de conexão (`src/config/database.js`) que utiliza variáveis de ambiente.

## ❗ Problema

A aplicação precisa de uma camada de abstração (ORM) para se comunicar com o banco de dados de forma segura e escalável, sem escrever SQL puro. A conexão atual (Task 01.3 antiga) não estava padronizada com o Sequelize, que é a ferramenta escolhida pela equipe. Além disso, a falta de uma conexão centralizada com a nuvem impede que todos os desenvolvedores trabalhem com o mesmo conjunto de dados.

## 🎯 Objetivo

- [ ] Instalar o Sequelize (`npm install sequelize`).
- [ ] Instalar o *driver* do banco de dados (ex: `npm install mysql2` se for MySQL).
- [ ] Modificar o arquivo `src/config/database.js`.
- [ ] Dentro do `database.js`:
    - [ ] Importar a classe `Sequelize`.
    - [ ] Ler as variáveis de ambiente (`DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`).
    - [ ] Instanciar o Sequelize passando as credenciais e o `dialect` (ex: 'mysql').
    - [ ] Exportar a *instância* do Sequelize (ex: `module.exports = sequelize`).


# Relatório da task

## :memo: Relatório de Testes - :white_check_mark: Aprovado

A implementação da conexão com o banco de dados foi validada com sucesso. A aplicação agora se comunica corretamente com a instância MySQL em nuvem através do Sequelize.

1.  **Conexão em Nuvem Estabelecida:** A aplicação conecta-se com sucesso à instância do banco de dados remoto ao iniciar, eliminando a dependência de um servidor MySQL local.
2.  **Configuração do ORM (Sequelize):** O arquivo `src/config/database.js` foi configurado corretamente. Ele instancia o Sequelize utilizando as variáveis de ambiente (`DB_HOST`, `DB_USER`, etc.) e o dialeto `mysql`, garantindo a segurança das credenciais.
3.  **Dependências:** As bibliotecas `sequelize` e `mysql2` foram instaladas e constam no `package.json`.
4.  **Padronização:** A mudança garante que todos os desenvolvedores acessem a mesma fonte de dados, resolvendo o problema de inconsistência entre ambientes locais.


---
# Taks 5 realizada:
---

## 📋 Descrição

Traduzir todo o *schema* SQL do `nexus_hub` para *Models* do Sequelize. Esta tarefa envolve a criação de um arquivo JavaScript para cada tabela (ex: `Usuario.js`, `Produto.js`) dentro da pasta `src/models/`. Além de definir todas as colunas com os `DataTypes` corretos, é essencial implementar todas as associações (relacionamentos) entre os *models* (ex: `belongsTo`, `hasMany`, `belongsToMany`).

## ❗ Problema

Embora a aplicação consiga *conectar-se* ao banco de dados (Task 01.3 e 01.4), ela ainda não tem "consciência" da estrutura dos dados. Sem os *Models* do Sequelize definidos, é impossível para a aplicação realizar operações de CRUD (Consultar, Criar, Atualizar, Deletar) de forma abstraída (ORM), que é o principal benefício de usar o Sequelize.

## 🎯 Objetivo 

1.  **Criação dos Arquivos de Model:**
    - [x] Criar a pasta `src/models/`.
    - [x] Criar os arquivos de *model* para cada tabela:
        - [x] `Usuario.js` (para `usuarios`)
        - [x] `Plataforma.js` (para `plataformas`)
        - [x] `Genero.js` (para `generos`)
        - [x] `Produto.js` (para `produtos`)
        - [x] `Compra.js` (para `compras`)
        - [x] `ItemCompra.js` (para `itens_compra`)
        - [x] `ChaveProduto.js` (para `chaves_produto`)
        - [x] `Promocao.js` (para `promocoes`)
    - [x] Mapear todas as colunas do SQL para os `DataTypes` corretos do Sequelize em cada *model* (ex: `VARCHAR` -> `DataTypes.STRING`, `DECIMAL` -> `DataTypes.DECIMAL`, `TIMESTAMP` -> `DataTypes.DATE`).
    - [x] Configurar os *models* para usar os nomes de `timestamps` customizados (`createdAt: 'criado_em'`, `updatedAt: 'atualizado_em'`).

2.  **Implementação das Associações (Relacionamentos):**
    - [x] Criar um arquivo `src/models/index.js` que importa a instância do `sequelize` (do config) e todos os *models* criados.
    - [x] Dentro do `index.js`, definir todas as associações (FKs) entre os *models*:
    - [x] **Usuario <-> Produto** (Parceiro): `Usuario.hasMany(Produto)` e `Produto.belongsTo(Usuario, { foreignKey: 'parceiro_id' })`.
    - [x] **Plataforma <-> Produto**: `Plataforma.hasMany(Produto)` e `Produto.belongsTo(Plataforma, { foreignKey: 'plataforma_id' })`.
    - [x] **Usuario <-> Compra** (Cliente): `Usuario.hasMany(Compra)` e `Compra.belongsTo(Usuario, { foreignKey: 'cliente_id' })`.
    - [x] **Compra <-> ItemCompra**: `Compra.hasMany(ItemCompra)` e `ItemCompra.belongsTo(Compra, { foreignKey: 'compra_id' })`.
    - [x] **Produto <-> ItemCompra**: `Produto.hasMany(ItemCompra)` e `ItemCompra.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    - [x] **Produto <-> ChaveProduto**: `Produto.hasMany(ChaveProduto)` e `ChaveProduto.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    * [x] **ItemCompra <-> ChaveProduto** (1:1): `ItemCompra.hasOne(ChaveProduto)` e `ChaveProduto.belongsTo(ItemCompra, { foreignKey: 'item_compra_id' })`.
    - [x] **Produto <-> Promocao** (1:1): `Produto.hasOne(Promocao)` e `Promocao.belongsTo(Produto, { foreignKey: 'produto_id' })`.
    - [x] **Produto <-> Genero** (N:M): `Produto.belongsToMany(Genero, { through: 'produto_generos' })` e `Genero.belongsToMany(Produto, { through: 'produto_generos' })`.
    - [x] Exportar todos os *models* e a instância do `sequelize` a partir do `index.js` para o restante da aplicação.

# Relatório da task

## 📄 Relatório de Teste - ✅ Aprovado

A task de Implementar **Models e Associações** foi concluída e aprovada.

Todos os objetivos foram validados com sucesso, estabelecendo o esquema de banco de dados do projeto de forma robusta e modularizada, utilizando o Sequelize. O _schema_ do banco de dados está totalmente pronto. A aplicação pode agora realizar operações de CRUD (_Create, Read, Update, Delete_) de forma abstrata, usando os métodos do Sequelize.

---
# Taks 6 realizada:
---

## 📋 Descrição

Esta tarefa consiste em instalar e configurar o `express-handlebars` como o motor de *views* (a camada *View* do MVC) e, ao mesmo tempo, criar os arquivos de layout mestres (`main.handlebars` e `dashboard.handlebars`). Esses layouts definirão a estrutura HTML fundamental (como `<html>`, `<head>`, `<body>`) e incluirão *partials* comuns (como *header* e *footer*), servindo como o "molde" para todas as outras páginas da aplicação.

## ❗ Problema

No momento, o servidor Express só consegue enviar respostas simples (como JSON ou texto). Ele não tem um "motor de renderização" configurado para processar e exibir páginas HTML dinâmicas. Sem os layouts base, teríamos que repetir o código HTML (`<head>`, `<meta>`, etc.) em todas as *views*, o que é péssimo para a manutenção.

## 🎯 Objetivo

- [x] Instalar o pacote `express-handlebars` (`npm install express-handlebars`).
- [x] No `app.js`, configurar o Express para usar o Handlebars, especificando os caminhos corretos conforme a especificação técnica:
    - O diretório principal de *views* (ex: `src/views`).
    - O diretório de *layouts* (ex: `src/views/layouts`).
    - O diretório de *partials* (ex: `src/views/partials`).
- [x] Criar o arquivo `src/views/layouts/main.hbs` (para a loja) com a estrutura HTML básica e um `{{{body}}}`.
- [x] Criar o arquivo `src/views/layouts/dashboard.hbs` (para painéis de admin/parceiro) com a estrutura HTML básica e um `{{{body}}}`.
- [x] Criar os *partials* `src/views/partials/header.hbs` e `src/views/partials/footer.hbs` (mesmo que vazios) e incluí-los corretamente nos layouts `main` e `dashboard`.


# Relatório da task

## 📄 Relatório de Teste - ✅ Aprovado

A task de **Instalação e Configuração do Motor de Views (Handlebars)** foi concluída e aprovada. Todos os objetivos foram validados, e a camada de visualização (_View_ do MVC) está agora totalmente funcional. As _views_ base estão configuradas, estilisticamente prontas e funcionando como o molde central. A partir de agora, a criação de novas páginas dinâmicas na aplicação será mais rápida e manutenível.

---
# Taks 7 realizada:
---

## 📋 Descrição

Configurar os *middlewares* essenciais da aplicação no `app.js` para processar requisições (JSON, URL-encoded) e servir arquivos estáticos. Além disso, esta task inclui a criação e registro do roteador mestre (`src/routes/index.js`), que centralizará todos os *endpoints* da aplicação.

## ❗ Problema

O `app.js` ainda não sabe como interpretar o corpo de requisições de formulários ou JSON, não consegue servir arquivos estáticos (como CSS e JS) e não possui nenhum sistema de rotas conectado para responder aos *endpoints*.

## 🎯 Objetivo (Critérios de Aceite)

- [x] Configurar em `app.js` o `express.static()` para servir a pasta `src/public`.
- [x] Configurar em `app.js` o `express.json()` e o `express.urlencoded({ extended: true })`.
- [x] Criar o arquivo `src/routes/index.js`, que irá importar e `usar` os demais arquivos de rota (ex: `auth.routes.js`, `catalog.routes.js`, etc.), exportando o roteador principal.
- [x] Importar o roteador mestre (de `src/routes/index.js`) e registrá-lo no `app.js` (ex: `app.use(routes)`).

# Relatório da task

## 📄 Relatório de Teste - ✅ Aprovado

A task de **Configuração Inicial de Middlewares e Roteador Mestre** foi concluída e aprovada. Todos os critérios de aceite foram validados, garantindo que a aplicação agora possui a infraestrutura básica necessária para processar requisições e servir o _frontend_. A aplicação está pronta para receber o desenvolvimento das funcionalidades, pois o roteador mestre (`routes/index.js`) está funcional e aguardando a importação das rotas específicas dos _endpoints_ (`auth.routes.js`, `catalog.routes.js`, etc.).

---
# Taks 8 realizada:
---

## 📋 Descrição

O projeto deve migrar do padrão de módulos **CommonJS** (`require/module.exports`) para o padrão moderno **ES Modules (ESM)** (`import/export`). Esta refatoração é essencial para alinhamento com as melhores práticas atuais do JavaScript, proporcionando melhor suporte a ferramentas modernas, sintaxe mais limpa e melhor interoperabilidade futura.

## ❗ Problema

Atualmente, o projeto está utilizando uma estrutura híbrida e inconsistente de módulos: alguns arquivos utilizam o padrão antigo **CommonJS**, enquanto outros já estão tentando adotar o padrão moderno **ES Modules (ESM)**. Esta coexistência de padrões incompatíveis está causando **conflitos de importação/exportação**, resultando em erros e quebras da aplicação ao tentar conectar e comunicar diferentes partes do sistema.

## 🎯 Objetivo (Critérios de Aceite)

- [x] Adicionar a propriedade `"type": "module"` ao `package.json`.
- [x] Substituir todas as instâncias de `const ... = require('...')` por `import express from '...'`.
- [x] Substituir todas as instâncias de `module.exports = { ... }` ou `exports.funcao = ...` por `export { ... }` ou `export default ...`.
- [x] Garantir que o servidor continue a inicializar, conectar ao banco de dados e rotear requisições sem erros.

# Relatório da task

## 📄 Relatório de Teste - ✅ Aprovado

A task de **Refatoração para ES Modules (ESM)** foi concluída e aprovada. Esta refatoração crítica resolveu os conflitos de importação/exportação causados pela estrutura híbrida de módulos no projeto, padronizando a sintaxe para o padrão moderno do JavaScript. A base de código está agora alinhada com as melhores práticas atuais, garantindo melhor manutenção, sintaxe mais limpa e maior estabilidade do sistema.


---
# Taks 9 realizada:
---


### 📝 Descrição da Feature

Implementar ferramentas de análise estática e formatação automática de código no projeto. O ESLint será responsável por identificar padrões incorretos e potenciais erros de lógica, enquanto o Prettier garantirá a consistência visual (indentação, aspas, vírgulas). A configuração deve garantir que ambos funcionem juntos sem conflitos.

### ❓ Problema Relacionado

Atualmente, não há regras automatizadas para o estilo de código. Isso pode levar a inconsistências entre arquivos (ex: um arquivo usa aspas duplas, outro simples; um usa ponto-e-vírgula, outro não), dificultando a leitura e a revisão de código (Code Review). Além disso, erros simples de sintaxe ou variáveis não utilizadas podem passar despercebidos até a execução.

### ✅ Critérios de Aceite

- [x] Instalar as dependências de desenvolvimento: `eslint`, `prettier`, `eslint-config-prettier` e `eslint-plugin-prettier` (para integrar os dois).
- [x] Criar o arquivo de configuração do Prettier (`.prettierrc`) na raiz, definindo regras básicas (ex: `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`).
- [x] Inicializar e configurar o ESLint (arquivo `.eslintrc.json` ou `eslint.config.js`), garantindo que:
    - [x] O ambiente esteja configurado para **Node.js** e **CommonJS** (já que migramos para `require`).
    - [x] Ele estenda as recomendações padrão (`eslint:recommended`) e a configuração do Prettier (`plugin:prettier/recommended`).
- [x] Adicionar scripts no `package.json` para facilitar o uso:
    - [x] `"lint"`: para apenas verificar os erros.
    - [x] `"lint:fix"`: para tentar corrigir automaticamente os erros de formatação.
- [x] Criar um arquivo `.eslintignore` e `.prettierignore` para ignorar pastas como `node_modules` e `dist` (se houver).
- [x] (Validação) Rodar `npm run lint` e garantir que ele analise os arquivos `.js` existentes (`src/**/*.js`) sem conflitos graves.

### 📎 Contexto Adicional

Exemplo de um arquivo `.prettierrc` recomendado para este projeto:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

Links úteis:

  * [Documentação Oficial do Prettier](https://prettier.io/docs/en/index.html)
  * [Integrando ESLint e Prettier](https://github.com/prettier/eslint-config-prettier)


## 📄 Relatório de Teste - ✅ Aprovado

A task de Implementar **ESLint e Prettier para Análise Estática e Formatação** foi concluída e aprovada. A integração das ferramentas foi validada com sucesso, garantindo a padronização e a consistência visual de todo o código-fonte, além da identificação automatizada de erros.

- Instalação e Configuração: Todas as dependências (`eslint, prettier, eslint-config-prettier, eslint-plugin-prettier`) foram instaladas, e os arquivos de configuração foram criados e configurados para funcionarem em conjunto.
- Scripts Criados e Testados: Os scripts `lint` e `lint:fix` foram adicionados ao `package.json`.
- Execução e Correção: O comando `npm run lint:fix` foi executado com sucesso, corrigindo automaticamente padrões de estilo (como aspas, ponto-e-vírgula e identação) em todos os arquivos `.js` existentes, conforme a validação reportada.