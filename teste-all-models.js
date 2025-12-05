import {
  sequelize,
  User,
  Platform,
  Product,
  Genre,
  Promotion,
  Purchase,
  PurchaseItem,
  ProductKey,
} from "./src/models/index.js";

async function runFullTest() {
  try {
    console.log("🔄 Conectando e Recriando o Banco...");
    // Force: true limpa tudo para testarmos do zero
    await sequelize.sync({ force: true });

    // --------------------------------------
    // 1. CONFIGURAÇÃO INICIAL (User, Platform, Genre)
    // --------------------------------------
    console.log("\n1️⃣  Criando Dados Básicos...");

    const parceiro = await User.create({
      nome: "Parceiro Games",
      email: "parceiro@teste.com",
      senha_hash: "123",
      data_nascimento: "1990-01-01",
      perfil: "parceiro",
    });

    const cliente = await User.create({
      nome: "Cliente Feliz",
      email: "cliente@teste.com",
      senha_hash: "123",
      data_nascimento: "2000-01-01",
      perfil: "cliente",
    });

    const steam = await Platform.create({ nome: "Steam", slug: "steam" });
    const generoAcao = await Genre.create({ nome: "Ação", slug: "acao" });
    const generoRPG = await Genre.create({ nome: "RPG", slug: "rpg" });

    // --------------------------------------
    // 2. CRIAÇÃO DO PRODUTO COM ASSOCIAÇÕES
    // --------------------------------------
    console.log("2️⃣  Criando Produto e Promoção...");

    const produto = await Product.create({
      titulo: "Elden Ring",
      slug: "elden-ring",
      descricao: "GOTY",
      preco: 250.0,
      parceiro_id: parceiro.id,
      plataforma_id: steam.id,
    });

    // Teste N:M (Produto <-> Genero)
    await produto.addGenres([generoAcao, generoRPG]); // Método mágico do Sequelize

    // Teste 1:1 (Produto <-> Promocao)
    await Promotion.create({
      produto_id: produto.id,
      percentual_desconto: 10,
      data_inicio: new Date(),
      data_fim: new Date(),
    });

    // Criando chaves para estoque
    await ProductKey.create({
      produto_id: produto.id,
      valor_chave: "KEY-AAAA-1111",
    }); // Estoque
    const chaveParaVender = await ProductKey.create({
      produto_id: produto.id,
      valor_chave: "KEY-BBBB-2222",
    });

    // --------------------------------------
    // 3. SIMULAÇÃO DE COMPRA (Fluxo Complexo)
    // --------------------------------------
    console.log("3️⃣  Simulando Compra...");

    const compra = await Purchase.create({
      cliente_id: cliente.id,
      preco_total: 225.0,
      status_pagamento: "aprovado",
    });

    const itemCompra = await PurchaseItem.create({
      compra_id: compra.id,
      produto_id: produto.id,
      preco_na_compra: 225.0,
    });

    // Simulando a entrega da chave (Atualizando a chave para vincular ao item)
    chaveParaVender.item_compra_id = itemCompra.id;
    chaveParaVender.foi_vendida = true;
    await chaveParaVender.save();

    // --------------------------------------
    // 4. VERIFICAÇÃO FINAL (Consultas)
    // --------------------------------------
    console.log("\n🔍 VERIFICANDO RELACIONAMENTOS:");

    // Busca Completa: Produto + Generos + Promoção
    const produtoChecagem = await Product.findOne({
      where: { slug: "elden-ring" },
      include: [
        { model: Genre, as: "genres" },
        { model: Promotion, as: "promotion" },
      ],
    });
    console.log(`> Produto: ${produtoChecagem.titulo}`);
    console.log(
      `> Gêneros: ${produtoChecagem.genres.map((g) => g.nome).join(", ")}`,
    ); // Deve imprimir: Ação, RPG
    console.log(
      `> Promoção: ${produtoChecagem.promotion.percentual_desconto}% OFF`,
    );

    // Busca Completa: Compra + Itens + Chave Entregue
    const compraChecagem = await Purchase.findOne({
      where: { id: compra.id },
      include: [
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: ProductKey, as: "deliveredKey" }], // Nested include (Item -> Chave)
        },
      ],
    });

    const item = compraChecagem.items[0];
    console.log(`> Compra de: ${cliente.nome}`);
    console.log(`> Item Comprado ID: ${item.id}`);
    console.log(
      `> Chave Recebida: ${item.deliveredKey ? item.deliveredKey.valor_chave : "NENHUMA (Erro)"}`,
    );

    console.log("\n✅ TODOS OS MODELS FORAM TESTADOS COM SUCESSO!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await sequelize.close();
  }
}

runFullTest();
