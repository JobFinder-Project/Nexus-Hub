# Documentação dos Diagramas de Sequência UML: Nexus-Hub

Os Diagramas de Sequência detalham a ordem cronológica das interações entre os Atores e os objetos do sistema (Página Web, Banco de Dados, Serviços) para executar os Casos de Uso. Eles são essenciais para o desenvolvimento dos Controllers e Services.

---

# 1. Fluxos de Autenticação (Acesso ao Sistema)

Estes diagramas cobrem o Caso de Uso central Gerenciar Autenticação (US04, US05).

## 1A. Fluxo de Criação de Conta (Registro)

O fluxo começa com o Usuário solicitando o formulário de cadastro. Ao enviar os dados, a Página Web verifica a unicidade do e-mail no Banco de Dados. Se o e-mail for novo e os dados válidos, a senha é hasheada, o registro de Usuario é criado com o perfil inicial ('Cliente' ou 'Parceiro' pendente) e a sessão é iniciada, redirecionando o usuário para a página principal já autenticado.

<img width="857" height="519" alt="CriarConta" src="https://github.com/user-attachments/assets/3ad482e4-e703-4e94-a958-f0e73c327754" />

## 1B. Fluxo de Autenticação (Login)

O Usuário solicita o formulário e envia as credenciais. A Página Web busca o usuário pelo e-mail no Banco de Dados. Em seguida, valida a senha (comparando o hash) e o status da conta. Se a autenticação for bem-sucedida e a conta estiver ativa, a sessão do usuário é iniciada e o acesso é concedido. Caso contrário, uma mensagem de erro é exibida.

<img width="825" height="461" alt="FazerLogin" src="https://github.com/user-attachments/assets/9bc77da1-5af6-4352-a918-afbd0b3f83fb" />

---

# 2. Fluxos do Cliente (Transações e Biblioteca)

Estes diagramas cobrem as interações de compra e acesso a produtos.

## 2.1. Fluxo de Compra e Checkout (US07)

O Cliente inicia o checkout. A Página Web verifica o carrinho e o estoque no Banco de Dados e cria um registro de Compra com status "Pendente". A requisição é enviada ao Serviço de Pagamento. Se o pagamento for aprovado, a Compra é atualizada para "Aprovado" no Banco de Dados, e a chave de ativação é alocada: o sistema marca uma Chave de Produto disponível como vendida, associando-a ao Item da Compra correspondente.

<img width="1010" height="584" alt="ComprarProduto" src="https://github.com/user-attachments/assets/59433ee1-0cbf-4f41-a9e7-fe359c92b7f0" />

## 2.2. Fluxo de Visualizar Chave de Ativação (US10)

O Cliente, em sua biblioteca, solicita ver a chave. A Página Web verifica o status da compra e o consentimento do cliente. Se a chave não tiver sido revelada anteriormente, o campo chaveReveladaEm na tabela ItemCompra é atualizado no Banco de Dados (marcando a perda do direito de devolução). Após a confirmação, a chave de ativação é exibida ao Cliente.

<img width="1031" height="467" alt="VisualizarChaveAtivação" src="https://github.com/user-attachments/assets/c4e526b4-5e57-4492-bcc8-501a8b5afb17" />

## 2.3. Fluxo de Navegar e Pesquisar com Filtros (US01, US02)

Ao carregar a página de catálogo, a Página Web consulta o Banco de Dados para buscar produtos e as opções de filtro disponíveis. Quando o Cliente aplica novos filtros (por Gênero, Preço, etc.), a Página Web realiza uma nova e otimizada consulta ao Banco de Dados com os critérios aplicados, e atualiza o catálogo exibido na interface.

<img width="875" height="364" alt="NavegarFiltros" src="https://github.com/user-attachments/assets/8592e0b5-0313-4472-baee-076b230d8509" />

---

# 3. Fluxos do Parceiro (Gestão e Relatórios)

Estes diagramas cobrem a gestão de produtos e o acompanhamento de performance.

## 2. Fluxo de Submeter Novo Jogo e Upload de Chaves (US11, US12)

O Parceiro envia os dados do jogo. A Página Web cria o registro de Produto no Banco de Dados com status Pendente de Aprovação e notifica a Página Admin sobre a pendência de curadoria. Em um fluxo subsequente, o Parceiro faz o upload de um arquivo de chaves, e a Página Web insere os múltiplos registros de Chave de Produto no Banco de Dados, associando-os ao produto, e atualiza a contagem de estoque.

<img width="1142" height="570" alt="SubmeterProduto" src="https://github.com/user-attachments/assets/76765241-af49-4a51-8cb8-557b2c2efa4f" />

## 5. Fluxo de Visualizar Relatório de Vendas (US17)

Ao acessar o dashboard, a Página Web executa múltiplas consultas agregadas no Banco de Dados, filtradas pelo ID do Parceiro. As consultas buscam dados como Vendas Totais, Receita e ranking dos produtos mais vendidos. A Página Web processa e formata esses dados antes de apresentá-los no dashboard ao Parceiro.

<img width="942" height="402" alt="VisualizarDashboardVendas" src="https://github.com/user-attachments/assets/6d5e45b4-3dcb-41ec-99c4-563e7402554a" />

---

# 4. Fluxos do Administrador (Curadoria e Moderação)

Estes diagramas cobrem os processos de controle e gestão da plataforma.

## 4.1. Fluxo de Aprovar Jogo pelo Administrador (US19)

O Administrador busca e visualiza a lista de jogos pendentes. Ao selecionar um jogo e escolher a ação (Aprovar ou Rejeitar), a Página Web atualiza o campo status do Produto no Banco de Dados. O Administrador recebe a confirmação de que o status do jogo foi alterado com sucesso.

<img width="1020" height="596" alt="AprovarRejeitarJogo" src="https://github.com/user-attachments/assets/a9c2e4da-fc73-4367-8527-8b25c74761ce" />

## 4.2. Fluxo de Gerenciar Parceiros/Usuários (US20, US23)

O Administrador acessa a lista de contas. A Página Web facilita a busca por contas pendentes e ativas. O Admin pode Aprovar/Rejeitar novos Parceiros (alterando perfil e status) ou Banir um usuário existente (alterando o status para 'Banido'). A ação resulta na atualização imediata do status da conta no Banco de Dados.

<img width="1544" height="745" alt="GerenciarContas" src="https://github.com/user-attachments/assets/0cfc9d14-7809-4509-ab53-9c8a28996c5c" />

## 4.3. Fluxo de Definir Jogos em Destaque (US22)

O Administrador utiliza o painel de gerenciamento de destaques. A Página Web busca os jogos aprovados e permite que o Administrador selecione um Produto para inseri-lo ou removê-lo de uma tabela de Destaques no Banco de Dados. Essa tabela de configuração é usada para renderizar a vitrine na página inicial da loja.

<img width="1310" height="422" alt="DefinirDestaques" src="https://github.com/user-attachments/assets/5ddafba7-e46b-4dfe-abd7-ea540449ddb0" />
