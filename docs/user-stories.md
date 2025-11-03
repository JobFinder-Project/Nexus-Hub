### Histórias de Usuário - Persona: Lucas Oliveira (Cliente)

#### **1. Navegação e Descoberta de Jogos**

* **US01:** Como um visitante (usuário não logado), eu quero navegar e pesquisar no catálogo de jogos para que eu possa descobrir novos títulos sem precisar criar uma conta.
    * **Critérios de Aceitação:**
        * Dado que sou um visitante, quando acesso o site, então vejo a página principal com os jogos em destaque.
        * Dado que estou em qualquer página da loja, quando uso a barra de busca, então recebo uma lista de jogos que correspondem à minha pesquisa.
        * Dado que sou um visitante, quando navego pela loja, então jogos com classificação "+18" não são exibidos para mim.

---

* **US02:** Como um cliente, eu quero filtrar os produtos por categoria, preço, gênero e plataforma ou tipo de serviço para que eu possa encontrar exatamente o que procuro, seja um jogo para meu console ou um gift card.
    * **Critérios de Aceitação:**
        * Dado que estou na página da loja, quando aplico um filtro de "Gênero: Ação", então a lista de jogos é atualizada para mostrar apenas jogos de ação.
        * Dado que estou na página da loja, quando aplico um filtro de "Preço: até R$50", então a lista de jogos é atualizada para mostrar apenas jogos dentro dessa faixa de preço.
        
        * Dado que estou na página da loja, quando aplico o filtro de "Plataforma: PlayStation", então a lista de produtos é atualizada para mostrar apenas jogos e gift cards compatíveis com PlayStation.

        * Dado que estou na página da loja, quando aplico o filtro de "Tipo: Gift Card", então a lista é atualizada para mostrar apenas os gift cards disponíveis (Spotify, Office 365, etc.).

---

* **US03:** Como um cliente, eu quero ver uma página de detalhes completa para cada jogo para que eu possa tomar uma decisão de compra informada.
    * **Critérios de Aceitação:**
        * Dado que clico em um jogo na loja, quando a página de detalhes carrega, então eu vejo o título, descrição, screenshots, preço, requisitos de sistema e classificação etária.

#### **2. Gerenciamento de Conta**

* **US04:** Como um visitante, eu quero criar uma conta fornecendo meus dados pessoais (incluindo data de nascimento) para que eu possa comprar jogos e acessar conteúdo restrito.
    * **Critérios de Aceitação:**
        * Dado que sou um visitante na página de cadastro, quando preencho todos os campos obrigatórios com dados válidos e submeto o formulário, então minha conta é criada e sou autenticado no sistema.
        * Dado que tento me cadastrar com um e-mail já existente, quando submeto o formulário, então recebo uma mensagem de erro informando que o e-mail já está em uso.
        * Dado que forneço uma data de nascimento que me classifica como menor de idade, quando navego na loja logado, então jogos "+18" continuam ocultos.

---

* **US05:** Como um cliente, eu quero fazer login na minha conta para que eu possa acessar minha biblioteca de jogos e realizar compras.
    * **Critérios de Aceitação:**
        * Dado que sou um cliente registrado, quando insiro meu e-mail e senha corretos na página de login, então sou autenticado e redirecionado para a página principal.
        * Dado que insiro credenciais incorretas, quando tento fazer login, então recebo uma mensagem de erro.

#### **3. Processo de Compra**

* **US06:** Como um cliente, eu quero adicionar e remover jogos do meu carrinho de compras para que eu possa selecionar os itens que desejo comprar.
    * **Critérios de Aceitação:**
        * Dado que estou na página de um jogo, quando clico no botão "Adicionar ao Carrinho", então o jogo é adicionado ao meu carrinho e um indicador visual (ex: no ícone do carrinho) é atualizado.
        * Dado que estou na página do carrinho, quando clico no botão "Remover" de um item, então o item é removido do carrinho.

---

* **US07:** Como um cliente, eu quero finalizar a compra a partir do meu carrinho para que eu possa pagar pelos jogos.
    * **Critérios de Aceitação:**
        * Dado que tenho itens no carrinho, quando clico em "Finalizar Compra", então sou redirecionado para a página de checkout.
        * Dado que não estou logado, quando tento finalizar a compra, então sou solicitado a fazer login ou criar uma conta antes de prosseguir.
        * Dado que estou no checkout, quando preencho as informações de pagamento (simulado) e confirmo a compra, então a transação é processada e fico aguardando a confirmação.

#### **4. Biblioteca e Acesso às Chaves**

* **US08:** Como um cliente, eu quero receber uma notificação por e-mail quando meu pagamento for aprovado para que eu saiba que minha compra foi bem-sucedida.
    * **Critérios de Aceitação:**
        * Dado que minha transação de pagamento foi confirmada pelo sistema, quando verifico minha caixa de entrada, então encontro um e-mail da plataforma confirmando minha compra.

---

* **US09:** Como um cliente, eu quero acessar uma biblioteca pessoal para que eu possa ver todos os jogos que já comprei.
    * **Critérios de Aceitação:**
        * Dado que estou logado, quando clico no link "Minha Biblioteca", então sou levado a uma página que lista as capas de todos os meus jogos adquiridos.

---

* **US10:** Como um cliente, eu quero visualizar a chave de ativação de um jogo comprado de forma segura para que eu possa resgatá-lo em outra plataforma.
    * **Critérios de Aceitação:**
        * Dado que estou na minha biblioteca e meu pagamento foi confirmado, quando clico em um jogo, então sou levado para a página de detalhes do jogo na minha biblioteca.
        * Dado que estou na página de detalhes, quando a chave de ativação está oculta, então vejo um checkbox com um aviso sobre a política de não devolução.
        * Dado que marco o checkbox de consentimento, quando clico no ícone "visualizar", então a chave de ativação é revelada para mim.

---

### Histórias de Usuário - Persona: Ana Costa (Parceiro)

#### **1. Gerenciamento de Jogos e Chaves**

* **US11:** Como uma parceira, eu quero submeter um novo jogo para aprovação, fornecendo todas as informações necessárias (título, descrição, imagens, preço, classificação etária) para que ele possa ser vendido na plataforma.
    * **Critérios de Aceitação:**
        * Dado que estou logada no meu painel de parceiro, quando preencho o formulário de submissão de novo jogo com dados válidos e o envio, então o jogo é salvo com o status "Pendente de Aprovação".
        * Dado que tento submeter um formulário com campos obrigatórios em branco, quando clico em enviar, então recebo mensagens de erro indicando os campos que precisam ser preenchidos.

---

* **US12:** Como uma parceira, eu quero fazer o upload de um lote de chaves de ativação para um dos meus jogos aprovados para que haja inventário disponível para venda.
    * **Critérios de Aceitação:**
        * Dado que tenho um jogo aprovado, quando seleciono a opção de gerenciar chaves e faço o upload de um arquivo `.txt` ou `.csv` com chaves válidas, então o sistema processa o arquivo e incrementa o estoque de chaves do jogo.

---
* **US13:** Como uma parceira, eu quero editar as informações de um jogo já aprovado (descrição, imagens, requisitos) para que eu possa manter a página do meu produto sempre atualizada.
    * **Critérios de Aceitação:**
        * Dado que estou no meu painel, quando seleciono um jogo e edito seus detalhes, então as alterações são salvas e submetidas para uma nova aprovação do administrador.
        * Dado que a alteração foi aprovada pelo administrador, quando acesso a página do jogo na loja, então vejo as informações atualizadas.

---

* **US14:** Como uma parceira, eu quero visualizar o nível de estoque de chaves dos meus jogos para que eu possa saber quando preciso fazer um novo upload.
    * **Critérios de Aceitação:**
        * Dado que estou na lista dos meus jogos no painel, quando olho para um jogo, então vejo a contagem atual de chaves disponíveis.
        * Dado que o estoque está abaixo de um limite (ex: 20 chaves), quando vejo a contagem, então ela é destacada visualmente (ex: em vermelho) para chamar minha atenção.

#### **2. Marketing e Preços**

* **US15:** Como uma parceira, eu quero poder alterar o preço base de um dos meus jogos para que eu possa ajustar minha estratégia de precificação.
    * **Critérios de Aceitação:**
        * Dado que estou na página de gerenciamento do meu jogo, quando edito o campo de preço e salvo, então o novo preço é refletido imediatamente na loja.

---

* **US16:** Como uma parceira, eu quero criar uma promoção para um jogo específico, definindo um percentual de desconto e um período de validade, para que eu possa impulsionar as vendas.
    * **Critérios de Aceitação:**
        * Dado que estou gerenciando um jogo, quando crio uma promoção, então defino uma data de início, uma data de fim e a porcentagem de desconto.
        * Dado que a data atual está dentro do período da promoção, quando um cliente visita a página do jogo, então ele vê o preço original riscado e o novo preço com desconto em destaque.
        * Dado que a data da promoção expirou, quando um cliente visita a página do jogo, então o preço volta automaticamente ao seu valor base.

#### **3. Acompanhamento de Resultados**

* **US17:** Como uma parceira, eu quero acessar um dashboard com as métricas de vendas dos meus jogos para que eu possa acompanhar meu desempenho na plataforma.
    * **Critérios de Aceitação:**
        * Dado que acesso o dashboard, então vejo um resumo de vendas, receita e jogos mais vendidos no último mês.
        * Dado que acesso o dashboard, quando seleciono um período de tempo diferente (ex: última semana, último ano), então os gráficos e os dados são atualizados.

---

### Histórias de Usuário - Persona: Ricardo Mendes (Administrador)

#### **1. Curadoria de Conteúdo**

* **US18:** Como um administrador, eu quero ver uma lista de todos os jogos submetidos que estão pendentes de aprovação para que eu possa realizar a curadoria do conteúdo da loja.
    * **Critérios de Aceitação:**
        * Dado que estou no painel administrativo, quando acesso a seção "Curadoria de Jogos", então vejo uma lista de todos os jogos com status "Pendente de Aprovação".

---

* **US19:** Como um administrador, eu quero aprovar ou rejeitar um jogo submetido para que eu possa controlar a qualidade do catálogo da plataforma.
    * **Critérios de Aceitação:**
        * Dado que estou visualizando um jogo pendente, quando clico no botão "Aprovar", então o status do jogo muda para "Aprovado" e ele se torna visível na loja (se tiver chaves em estoque).
        * Dado que estou visualizando um jogo pendente, quando clico no botão "Rejeitar", então o status do jogo muda para "Rejeitado" e o parceiro é notificado.

---

* **US20:** Como um administrador, eu quero gerenciar o cadastro de parceiros, aprovando ou rejeitando novas solicitações, para que eu possa garantir a confiabilidade dos vendedores na plataforma.
    * **Critérios de Aceitação:**
        * Dado que um novo desenvolvedor se cadastrou como parceiro, quando acesso o painel, então vejo uma notificação e um item na lista de "Parceiros Pendentes".
        * Dado que estou analisando uma solicitação, quando clico em "Aprovar", então a conta do parceiro é ativada e ele pode começar a submeter jogos.

---
#### **2. Gerenciamento da Loja (Storefront)**

* **US21:** Como um administrador, eu quero poder gerenciar as categorias e gêneros de jogos (criar, editar, excluir) para que a loja seja bem organizada e fácil de navegar.
    * **Critérios de Aceitação:**
        * Dado que estou no painel, quando acesso a seção "Categorias", então posso adicionar uma nova categoria (ex: "Estratégia em Turnos").
        * Dado que edito uma categoria, quando salvo, então todos os jogos associados a ela refletem a mudança.

---

<!-- * **US21:** Como um administrador, eu quero poder gerenciar as plataformas (PC, PlayStation, Xbox, etc.) e os tipos de produto (Jogo, Gift Card, Assinatura) disponíveis na loja para que o catálogo de produtos seja flexível e possa ser expandido no futuro.
    * **Critérios de Aceitação:**
        * Dado que estou no painel, quando acesso a seção "Categorias", então posso adicionar uma nova categoria (ex: "Estratégia em Turnos").
        * Dado que edito uma categoria, quando salvo, então todos os jogos associados a ela refletem a mudança.
        * Dado que estou no painel de administração, quando acesso a seção de "Gerenciamento da Loja", então encontro opções para "Plataformas" e "Tipos de Produto".
        * Dado que acesso a gestão de "Plataformas", quando adiciono uma nova plataforma (ex: "Nintendo Switch"), então ela passa a estar disponível como uma opção de filtro na loja e para os parceiros ao submeterem um novo produto.


--- -->

* **US22:** Como um administrador, eu quero definir quais jogos aparecerão na seção de "Destaques" da página inicial para que eu possa promover títulos específicos ou de alta performance.
    * **Critérios de Aceitação:**
        * Dado que estou no painel de gerenciamento da loja, quando pesquiso por um jogo aprovado e o adiciono à lista de destaques, então ele aparece na vitrine principal do site.
        * Dado que removo um jogo da lista de destaques, então ele deixa de aparecer na vitrine principal.


#### **3. Gerenciamento da Plataforma**

* **US23:** Como um administrador, eu quero gerenciar os usuários da plataforma (clientes e parceiros) para que eu possa intervir em caso de atividades fraudulentas ou problemas.
    * **Critérios de Aceitação:**
        * Dado que estou no painel de gerenciamento de usuários, quando pesquiso por um usuário, então consigo encontrar seu perfil.
        * Dado que estou visualizando o perfil de um usuário, quando clico em "Banir", então a conta do usuário é desativada e ele não pode mais fazer login.
---

* **US24:** Como um administrador, eu quero visualizar um dashboard geral com as principais métricas da plataforma para que eu possa ter uma visão clara da saúde do negócio.
    * **Critérios de Aceitação:**
        * Dado que acesso o dashboard, então vejo dados de vendas totais, receita da plataforma (comissão), novos usuários e jogos pendentes.
        * Dado que acesso o dashboard, então vejo gráficos que mostram a evolução das vendas ao longo do tempo.

---

* **US26:** Como um administrador, eu quero monitorar o inventário de chaves de todos os jogos da plataforma para que eu possa identificar produtos com baixo estoque e notificar os parceiros.
    * **Critérios de Aceitação:**
        * Dado que estou no painel, quando acesso a seção de "Inventário", então vejo uma lista de todos os jogos e suas contagens de chaves.
        * Dado que estou nesta lista, quando uso o filtro "Baixo Estoque", então vejo apenas os jogos com um número de chaves abaixo de um limite pré-definido.