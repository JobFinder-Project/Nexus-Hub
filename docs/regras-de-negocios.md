### Regras de Negócio (Business Rules)

Podemos organizar as regras por domínio para facilitar a consulta durante o desenvolvimento.

#### **RN-USUARIOS (Regras de Usuários e Autenticação)**

* **RN-USU01:** O e-mail de um usuário é único em toda a plataforma. Não podem existir dois usuários (seja cliente ou parceiro) com o mesmo e-mail.
* **RN-USU02:** Para se cadastrar, o usuário deve fornecer uma data de nascimento válida. A idade do usuário será calculada com base nesta data.
* **RN-USU03:** Um usuário autenticado cuja idade seja inferior a 18 anos não pode visualizar ou comprar produtos com classificação etária "+18".
* **RN-USU04:** Um usuário não autenticado (visitante) não pode visualizar produtos com classificação etária "+18".
* **RN-USU05:** O processo de checkout só pode ser iniciado por um usuário autenticado.

#### **RN-PRODUTOS (Regras de Produtos e Catálogo)**

* **RN-PRO01:** Um novo produto submetido por um parceiro deve sempre ter o status inicial de "Pendente de Aprovação" e não será visível na loja.
* **RN-PRO02:** Um produto só se torna visível para compra na loja se tiver o status "Aprovado" E possuir ao menos uma chave em estoque.
* **RN-PRO03:** Qualquer edição nas informações de um produto já aprovado (como descrição ou imagens) deve fazer com que o produto retorne ao status "Pendente de Aprovação" para reavaliação do administrador.
* **RN-PRO04:** A alteração de preço de um produto não requer nova aprovação do administrador.
* **RN-PRO05:** Cada produto deve ser associado a pelo menos uma "Plataforma" (PC, PlayStation, etc.) e um "Tipo" (Jogo, Gift Card).

#### **RN-VENDAS (Regras de Vendas e Transações)**

* **RN-VEN01:** O acesso à chave de ativação de um produto só é concedido após a confirmação do pagamento pela plataforma de pagamento.
* **RN-VEN02:** Uma vez que o cliente visualize uma chave de ativação (após marcar o checkbox de consentimento), o produto associado àquela compra é permanentemente marcado como não elegível para devolução.
* **RN-VEN03:** Após a confirmação de um pagamento, o sistema deve automaticamente enviar um e-mail de notificação para o cliente.
* **RN-VEN04:** O sistema deve decrementar a quantidade de chaves em estoque de um produto imediatamente após uma venda ser confirmada.

#### **RN-PROMOCOES (Regras de Promoções)**

* **RN-PROMO01:** Uma promoção deve ter obrigatoriamente uma data de início, uma data de fim e um percentual de desconto.
* **RN-PROMO02:** O preço promocional de um produto só é aplicado na loja durante o período de validade da promoção. Fora desse período, o preço base é o que vigora.
* **RN-PROMO03:** O percentual de desconto de uma promoção não pode ser 0% ou maior que 100%. (Podemos definir um limite, ex: 95%).

#### **RN-PARCEIROS (Regras de Parceiros)**

* **RN-PAR01:** Uma nova conta de parceiro deve ser aprovada por um administrador antes que o parceiro possa submeter produtos.
* **RN-PAR02:** Um parceiro só pode gerenciar (editar, adicionar chaves, criar promoções) os produtos que ele mesmo submeteu.
