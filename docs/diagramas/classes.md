# Documentação do Diagrama de Classes UML: Nexus-Hub

Este documento explica a estrutura e os relacionamentos definidos no Diagrama de Classes UML, que é o modelo de domínio (camada Model na arquitetura MVC) do projeto Nexus-Hub. Ele representa a estrutura das tabelas do banco de dados e a lógica de como as entidades se conectam.

---

<img width="915" height="924" alt="ClassDiagram" src="https://github.com/user-attachments/assets/2a21a2a4-7e11-4918-8b83-a0326b2e9906" />

---

## 1. Visão Geral das Entidades (Classes)

A estrutura do sistema é organizada em torno de três pilares: **Contas**, **Catálogo/Inventário** e **Transações**.

| Classe       | Propósito Principal no Sistema                                           | Módulo      |
|--------------|---------------------------------------------------------------------------|-------------|
| Usuario      | Representa todos os usuários (Clientes, Parceiros e Administradores). Base para autenticação. | Contas |
| Produto      | O item digital vendido (jogo). O catálogo da loja.                       | Catálogo    |
| ChaveProduto | O inventário digital. Cada registro é uma chave de ativação única.       | Inventário  |
| Compra       | Representa a transação completa (o pedido realizado pelo Cliente).        | Transações  |
| ItemCompra   | Detalha os produtos e preços vendidos em uma Compra específica.          | Transações  |
| Promocao     | Aplica descontos temporários ao Produto.                                 | Catálogo    |
| Plataforma   | Define a plataforma de destino do produto (Ex: PC, PlayStation).         | Catálogo    |
| Genero       | Classifica o produto (Ex: Ação, RPG).                                    | Catálogo    |

---

## 2. Detalhamento das Classes e Atributos Chave

### **Usuario**
**Funcionalidade:** Centraliza a gestão de identidades e perfis.

**Atributos Chave:**
- `email`: Deve ser único para o login.  
- `senhaHash`: Armazenamento seguro da senha.  
- `perfil`: Define o papel (Cliente, Parceiro, Administrador).  

---

### **Produto**
**Funcionalidade:** Armazena metadados e estado do jogo no catálogo.

**Atributos Chave:**
- `parceiro_id`: Chave estrangeira do criador/vendedor.  
- `preco`: Preço base do produto.  
- `status`: Estado de curadoria (ex.: "Pendente de Aprovação", "Aprovado").  

---

### **ChaveProduto**
**Funcionalidade:** Gerencia o estoque rastreável de chaves.

**Atributos Chave:**
- `valorChave`: Código alfanumérico da chave.  
- `foiVendida`: Booleano indicando se já foi alocada.  
- `itemCompra_id`: Venda específica que consumiu esta chave.  

---

### **Compra**
**Funcionalidade:** Registro principal da transação.

**Atributos Chave:**
- `cliente_id`: Identifica o comprador.  
- `precoTotal`: Valor final.  
- `statusPagamento`: Estado (ex.: "Pendente", "Aprovado").  

---

### **ItemCompra**
**Funcionalidade:** Preserva o histórico de preços.

**Atributos Chave:**
- `produto_id`: Produto comprado.  
- `precoNaCompra`: Preço pago no momento.  
- `chaveReveladaEm`: Timestamp que marca quando o cliente perde o direito de devolução.  

---

## 3. Explicação dos Relacionamentos

Os relacionamentos definem regras de integridade e navegação entre entidades.

---

## **3.1 Relações Um para Muitos (1:N)**

| Relação                     | De                      | Para         | Descrição |
|----------------------------|--------------------------|--------------|-----------|
| Autoria de Produto         | Usuario (Parceiro)       | Produto      | Um parceiro submete vários produtos. |
| Realização de Compra       | Usuario (Cliente)        | Compra       | Um cliente realiza várias compras. |
| Itens da Compra            | Compra                   | ItemCompra   | Uma compra possui vários itens. |
| Chaves de Estoque          | Produto                  | ChaveProduto | Um produto possui muitas chaves. |
| Classificação por Plataforma | Plataforma             | Produto      | Uma plataforma contém vários produtos. |
| Promoções Aplicadas        | Produto                  | Promocao     | Um produto pode ter várias promoções ao longo do tempo. |

---

## **3.2 Relação Um para Um (1:1)**

| Relação              | De          | Para         | Descrição |
|----------------------|-------------|--------------|-----------|
| Alocação de Chave    | ItemCompra  | ChaveProduto | Cada item vendido está vinculado a uma única chave de ativação. |

---

## **3.3 Relação Muitos para Muitos (N:M)**

| Relação                | Envolvidos             | Tabela Associativa | Descrição |
|------------------------|-------------------------|---------------------|-----------|
| Classificação por Gênero | Produto e Genero      | `produto_genero`    | Produtos têm vários gêneros e gêneros se aplicam a vários produtos. |

