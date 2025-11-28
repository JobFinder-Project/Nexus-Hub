# Documentação UML: Casos de Uso do Nexus-Hub

Os Diagramas de Casos de Uso representam os requisitos funcionais do sistema Nexus-Hub, definindo as interações entre os usuários (Atores) e as funcionalidades principais do sistema.

---

# 1. Perfil: Cliente

O Cliente é o usuário final que interage com a loja para navegar, comprar e acessar produtos digitais.

<img width="874" height="801" alt="UseCaseCliente" src="https://github.com/user-attachments/assets/768e33b2-3a5a-45b5-a7f7-b4a40f6d2d5b" />

## 1.1. Casos de Uso Principais

| Caso de Uso                     | Descrição                                                                 | US Relacionadas                        |
|----------------------------------|---------------------------------------------------------------------------|-----------------------------------------|
| Navegar e Pesquisar na Loja     | Permite ao usuário (logado ou visitante) explorar o catálogo de jogos.   | US01 (Navegar), US02 (Filtrar)         |
| Comprar Produtos                | Fluxo de adição ao carrinho e finalização da transação.                   | US06, US07, US08                        |
| Gerenciar Autenticação          | Permite o acesso e a criação de contas na plataforma.                    | US04, US05                              |
| Gerenciar Biblioteca            | Visualização de compras e acesso a produtos adquiridos.                  | US09, US10                              |

---

## 1.2. Relações e Fluxos Secundários

| Relação             | Origem                         | Destino                        | Tipo                | Explicação |
|---------------------|---------------------------------|----------------------------------|----------------------|-----------|
| Fluxo de Exploração | Navegar e Pesquisar na Loja     | Ver Detalhes do Produto         | &lt;&lt;extend&gt;&gt;  | O usuário pode optar por ver detalhes de um produto. |
| Fluxo de Exploração | Navegar e Pesquisar na Loja     | Filtrar Produtos                | &lt;&lt;extend&gt;&gt;  | O usuário pode aplicar filtros na busca. |
| Fluxo de Compra     | Comprar Produtos                | Gerenciar Carrinho              | &lt;&lt;extend&gt;&gt;  | Adicionar/remover itens antes de comprar. |
| Fluxo de Compra     | Comprar Produtos                | Processar Checkout              | &lt;&lt;include&gt;&gt; | Pagamento obrigatório para concluir a compra. |
| Fluxo de Biblioteca | Gerenciar Biblioteca            | Visualizar Chave de Ativação    | &lt;&lt;extend&gt;&gt;  | Envolve consentimento e registro da revelação da chave. |
| Fluxo de Acesso     | Gerenciar Autenticação          | Criar Conta                     | &lt;&lt;include&gt;&gt; | Passo obrigatório para autenticação. |
| Fluxo de Acesso     | Gerenciar Autenticação          | Fazer Login                     | &lt;&lt;include&gt;&gt; | Passo fundamental do processo de autenticação. |

---

# 2. Perfil: Parceiro

O Parceiro gerencia seu catálogo de jogos, fornece inventário de chaves e monitora vendas.

<img width="857" height="802" alt="UseCaseParceiro" src="https://github.com/user-attachments/assets/8d2c4ae9-9d97-4587-9a44-2927cccb8e74" />

## 2.1. Casos de Uso Principais

| Caso de Uso                   | Descrição                                                                   | US Relacionadas                 |
|-------------------------------|-----------------------------------------------------------------------------|----------------------------------|
| Gerenciar produto e estoque  | Submissão, edição de jogos e controle de estoque.                           | US11, US13, US14, US15          |
| Fazer upload de chaves       | Envio do inventário de chaves para o sistema.                               | US12                             |
| Visualizar relatório de vendas | Acesso ao dashboard com métricas de desempenho.                           | US17                             |

---

## 2.2. Relações e Fluxos Secundários

| Relação             | Origem                     | Destino                     | Tipo         | Explicação |
|---------------------|-----------------------------|-----------------------------|--------------|-----------|
| Fluxo de Gestão     | Gerenciar produto e estoque | Editar Informações do Jogo  | &lt;&lt;extend&gt;&gt;   | O parceiro pode editar detalhes de um jogo existente (US13). |
| Fluxo de Gestão     | Gerenciar produto e estoque | Gerenciar Promoções         | &lt;&lt;extend&gt;&gt;   | Criação de promoções para um jogo (US16). |
| Fluxo de Acesso     | Gerenciar Autenticação      | Criar Conta                 | &lt;&lt;include&gt;&gt;  | O parceiro também deve criar conta (com aprovação do Admin). |
| Fluxo de Acesso     | Gerenciar Autenticação      | Fazer Login                 | &lt;&lt;include&gt;&gt;  | Login necessário para acessar o painel do parceiro. |

---

# 3. Perfil: Administrador

O Administrador é responsável pela curadoria, moderação e manutenção da plataforma.

<img width="969" height="825" alt="UseCaseAdm" src="https://github.com/user-attachments/assets/c4d80de4-c5f5-40e2-bc8d-eb0cd38f0cc7" />

## 3.1. Casos de Uso Principais

| Caso de Uso                         | Descrição                                                                   | US Relacionadas |
|--------------------------------------|-----------------------------------------------------------------------------|------------------|
| Gerenciar conteúdo                   | Aprovação e rejeição de jogos submetidos.                                  | US18, US19       |
| Gerenciar configurações da plataforma | Manutenção de gêneros, categorias e destaques da loja.                      | US21, US22       |
| Monitorar plataforma                 | Acompanhamento da saúde do negócio e inventário.                            | US24, US26       |
| Gerenciar usuários                   | Moderação e intervenção em contas de clientes e parceiros.                  | US23             |

---

## 3.2. Relações e Fluxos Secundários

| Relação                | Origem                               | Destino                        | Tipo         | Explicação |
|------------------------|----------------------------------------|----------------------------------|--------------|-----------|
| Fluxo de Curadoria     | Gerenciar conteúdo                    | Aprovar/Rejeitar jogo            | &lt;&lt;include&gt;&gt;  | Etapa obrigatória na curadoria de novos jogos. |
| Fluxo de Curadoria     | Gerenciar conteúdo                    | Aprovar/Rejeitar parceiro        | &lt;&lt;include&gt;&gt;  | Etapa obrigatória para novos vendedores. |
| Fluxo de Configuração  | Gerenciar configurações da plataforma | Gerenciar categorias/gêneros     | &lt;&lt;include&gt;&gt;  | Parte essencial da configuração da loja. |
| Fluxo de Configuração  | Gerenciar configurações da plataforma | Definir jogos em destaque        | &lt;&lt;include&gt;&gt;  | Parte essencial da configuração da loja. |
| Fluxo de Monitoramento | Monitorar plataforma                  | Monitorar inventário             | &lt;&lt;extend&gt;&gt;   | O Admin pode optar por visualizar o inventário. |
| Fluxo de Moderação     | Gerenciar usuários                    | Banir usuário                    | &lt;&lt;extend&gt;&gt;   | Ação opcional que pode ser executada na moderação. |

