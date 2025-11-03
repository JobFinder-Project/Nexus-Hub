### Proposta de Projeto Final: Plataforma de Distribuição Digital de Jogos

#### 1. Título do Projeto
**Nexus-Hub: Marketplace de Chaves Digitais de Jogos** 

#### 2. Justificativa
O mercado de jogos digitais é um dos setores que mais cresce na indústria do entretenimento. Plataformas como Steam, GOG e Nuuvem dominam este espaço, mas a criação de um marketplace similar, mesmo que em escala reduzida, oferece uma excelente oportunidade de aprendizado. Este projeto abordará conceitos cruciais de desenvolvimento web, como:
* **Arquitetura MVC (Model-View-Controller)** ou baseada em componentes (com APIs RESTful).
* **Autenticação e Autorização** para diferentes tipos de usuários.
* **Operações CRUD (Create, Read, Update, Delete)** em múltiplas entidades (jogos, usuários, chaves, pedidos).
* **Processamento de pagamentos** (simulado, utilizando APIs de sandbox).
* **Gerenciamento de inventário** (chaves de jogos).
* **Criação de dashboards** para análise de dados (vendas, acessos).

O projeto é desafiador, porém modular, permitindo a entrega de um **Produto Mínimo Viável (MVP)** com funcionalidades essenciais e a possibilidade de expansão futura.

#### 3. Objetivos
* **Geral:** Desenvolver uma plataforma web funcional e segura para a comercialização de chaves de ativação de jogos, conectando desenvolvedores/parceiros a clientes finais.
* **Específicos:**
    * Implementar um sistema de cadastro e login seguro para os três perfis de usuário (Cliente, Parceiro, Administrador).
    * Construir uma vitrine de produtos (jogos) com sistema de busca e filtros.
    * Desenvolver um carrinho de compras e um fluxo de checkout simulado.
    * Criar uma área de usuário onde o cliente pode visualizar suas chaves compradas.
    * Implementar um painel para o parceiro gerenciar seus jogos e visualizar o relatório de vendas.
    * Desenvolver um painel administrativo para gerenciamento completo da plataforma (usuários, jogos, categorias, aprovações).
     * Implementar um sistema de navegação anônima com restrição de conteúdo para maiores de 18 anos, garantindo uma experiência de usuário fluida e responsável.

#### 4. Funcionalidades Principais por Perfil

**a) Perfil do Cliente:**
* **Autenticação:** Cadastro, login, recuperação de senha.
* **Vitrine:** Navegar por jogos, ver detalhes (descrição, screenshots, preço, requisitos), buscar e filtrar por gênero, preço, etc.
* **Carrinho de Compras:** Adicionar/remover jogos do carrinho.
* **Checkout:** "Comprar" os itens do carrinho (usando uma API de pagamento em modo de teste, como Stripe Sandbox ou PayPal Sandbox).
* **Biblioteca Pessoal:** Visualizar a lista de jogos comprados e suas respectivas chaves de ativação.
* **Gerenciamento de Perfil:** Alterar dados pessoais e senha.
* **Fluxo de Compra e Ativação:**
     1.  **Confirmação de Pagamento:** O sistema aguardará a confirmação da transação por parte do gateway de pagamento (via webhook, por exemplo).
     2.  **Notificação:** Após a aprovação, o cliente receberá um e-mail confirmando a compra e informando que o produto está disponível em sua biblioteca.
     3.  **Acesso Seguro:** Na sua biblioteca pessoal, o jogo comprado estará visível, mas o acesso à chave de ativação só será liberado após a confirmação do pagamento.
     4.  **Revelação da Chave:** A chave de ativação ficará oculta por padrão. Para visualizá-la, o cliente deverá marcar uma caixa de seleção com o texto: "Estou ciente de que, ao visualizar esta chave, o produto não poderá mais ser devolvido." e, em seguida, clicar em um ícone (ex: "olho") para revelar o código.

**b) Perfil do Parceiro (Desenvolvedor):**
* **Autenticação:** Sistema de registro próprio (pode precisar de aprovação do admin).
* **Dashboard:** Painel com estatísticas de vendas, receita gerada e jogos mais vendidos.
* **Gerenciamento de Jogos:** Submeter novos jogos para aprovação do admin (com título, descrição, imagens, preço sugerido).
* **Gerenciamento de Chaves:** Fazer upload de lotes de chaves de ativação para os jogos aprovados.
* **Relatórios Financeiros:** Visualizar histórico de vendas e pagamentos a receber.

**c) Perfil do Administrador:**
* **Dashboard Geral:** Visão geral da plataforma (novos usuários, vendas totais, jogos pendentes).
* **Gerenciamento de Usuários:** Listar, visualizar, bloquear ou remover usuários (clientes e parceiros).
* **Curadoria de Jogos:** Aprovar ou rejeitar os jogos submetidos pelos parceiros.
* **Gerenciamento da Loja:** Definir jogos em destaque, criar promoções e gerenciar categorias/gêneros.
* **Gerenciamento de Inventário:** Visualizar a quantidade de chaves disponíveis para cada jogo.
