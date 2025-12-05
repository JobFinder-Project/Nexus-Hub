import {
  Product,
  Platform,
  Genre,
  Promotion,
  ProductKey,
  PurchaseItem,
  Purchase,
  User,
  Requirement,
} from '../models/index.js';

// util: calcula estoque (chaves disponíveis) por produto
async function computeStockFor(products) {
  return Promise.all(
    products.map(async (p) => {
      const disponiveis = await ProductKey.count({
        where: { produto_id: p.id, foi_vendida: false },
      });
      return { id: p.id, stock: disponiveis };
    })
  );
}

// GET /dashboard/partner-test
const renderPartnerHome = async (req, res, next) => {
  try {
    const partnerId = req.session.userId;

    // KPIs básicos do parceiro
    const [products, itemsVendidos] = await Promise.all([
      Product.findAll({ where: { parceiro_id: partnerId }, attributes: ['id', 'titulo'] }),
      PurchaseItem.findAll({
        include: [{ model: Product, as: 'product', attributes: ['parceiro_id'] }],
      }),
    ]);

    const meusItens = itemsVendidos.filter((i) => i.product?.parceiro_id === partnerId);
    const kpis = [
      { label: 'Jogos', value: products.length, icon: 'gamepad', color: 'purple' },
      { label: 'Vendas', value: meusItens.length, icon: 'shopping-bag', color: 'green' },
    ];

    // Estoque baixo
    const fullProducts = await Product.findAll({
      where: { parceiro_id: partnerId },
      include: [
        { model: Platform, as: 'platform' },
        { model: Promotion, as: 'promotion' },
      ],
      order: [['criado_em', 'DESC']],
    });
    const stocks = await computeStockFor(fullProducts);
    const stockMap = new Map(stocks.map((s) => [s.id, s.stock]));
    const lowStockItems = fullProducts
      .map((p) => ({
        title: p.titulo,
        keysLeft: stockMap.get(p.id) ?? 0,
      }))
      .filter((x) => x.keysLeft <= 5);

    // Histórico (últimos 5) com status
    const lastSales = await Purchase.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      include: [
        {
          model: PurchaseItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['titulo', 'parceiro_id'] }],
        },
      ],
    });
    const salesHistory = [];
    for (const purchase of lastSales) {
      const dataCompra =
        purchase.data_compra || purchase.criado_em || purchase.updatedAt || new Date();
      const statusPagamento = purchase.status_pagamento || 'pendente';
      for (const item of purchase.items || []) {
        const it = item.get ? item.get({ plain: true }) : item;
        const prod = it.product;
        if (prod?.parceiro_id === partnerId) {
          salesHistory.push({
            data: new Date(dataCompra).toLocaleDateString('pt-BR'),
            produto: prod.titulo,
            valor: `R$ ${Number(it.preco_na_compra || 0).toFixed(2)}`,
            status: statusPagamento,
          });
        }
      }
    }

    // Promoções ativas
    const promos = await Promotion.findAll({
      include: [{ model: Product, as: 'product', where: { parceiro_id: partnerId } }],
      where: {},
    });
    const activePromotions = promos.map((pr) => ({
      title: pr.product?.titulo || 'Produto',
      product: pr.product?.titulo || '',
      discount: `${pr.percentual_desconto}%`,
    }));

    const productsViews = fullProducts.map((p) => {
      const plain = p.get({ plain: true });
      return {
        id: plain.id,
        titulo: plain.titulo,
        slug: plain.slug,
      };
    });

    return res.render('dashboard/home', {
      layout: 'dashboard',
      title: 'Painel do Parceiro',
      pageTitle: 'Visão Geral',
      activePage: 'home',
      userRole: 'parceiro',
      kpis,
      lowStockItems,
      salesHistory,
      products: productsViews,
      activePromotions,
      chartData: JSON.stringify({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{ label: 'Vendas', data: [2, 5, 3, 7, 4, 8], borderColor: '#7000ff' }],
      }),
    });
  } catch (err) {
    return next(err);
  }
};

// GET /dashboard/products (parceiro)
const renderPartnerProducts = async (req, res, next) => {
  try {
    const partnerId = req.session.userId;
    const [products, platforms, genres] = await Promise.all([
      Product.findAll({
        where: { parceiro_id: partnerId },
        include: [
          { model: Platform, as: 'platform' },
          { model: Promotion, as: 'promotion' },
          { model: Requirement, as: 'systemRequirements' },
        ],
        order: [['criado_em', 'DESC']],
      }),
      Platform.findAll(),
      Genre.findAll(),
    ]);

    const stocks = await computeStockFor(products);
    const stockMap = new Map(stocks.map((s) => [s.id, s.stock]));

    // Histórico (últimos 5) com status
    const lastSales = await Purchase.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      include: [
        {
          model: PurchaseItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['titulo', 'parceiro_id'] }],
        },
      ],
    });
    const salesHistory = [];
    for (const purchase of lastSales) {
      const dataCompra =
        purchase.data_compra || purchase.criado_em || purchase.updatedAt || new Date();
      const statusPagamento = purchase.status_pagamento || 'pendente';
      for (const item of purchase.items || []) {
        const it = item.get ? item.get({ plain: true }) : item;
        const prod = it.product;
        if (prod?.parceiro_id === partnerId) {
          salesHistory.push({
            data: new Date(dataCompra).toLocaleDateString('pt-BR'),
            produto: prod.titulo,
            valor: `R$ ${Number(it.preco_na_compra || 0).toFixed(2)}`,
            status: statusPagamento,
          });
        }
      }
    }

    const productsView = products.map((p) => {
      const plain = p.get({ plain: true });
      return {
        id: plain.id,
        titulo: plain.titulo,
        slug: plain.slug,
        descricao: plain.descricao,
        plataforma: plain.platform?.nome || '-',
        plataforma_id: plain.plataforma_id,
        preco: Number(plain.preco).toFixed(2),
        estoque: stockMap.get(plain.id) ?? 0,
        status: plain.status || 'ativo',
        imagem: plain.cover || 'https://placehold.co/80x100/1a1a1a/fff?text=IMG',
        requirements: plain.systemRequirements
          ? {
              os: plain.systemRequirements.os,
              processador: plain.systemRequirements.processador,
              memoria: plain.systemRequirements.memoria,
              graficos: plain.systemRequirements.graficos,
              armazenamento: plain.systemRequirements.armazenamento,
            }
          : null,
      };
    });

    return res.render('dashboard/products', {
      layout: 'dashboard',
      title: 'Produtos',
      pageTitle: 'Meus Jogos',
      activePage: 'products',
      userRole: 'parceiro',
      session: req.session,
      salesHistory, // <- usado pelo modal de relatórios
      products: productsView,
      platforms: platforms.map((x) => x.get({ plain: true })),
      genres: genres.map((x) => x.get({ plain: true })),
    });
  } catch (err) {
    return next(err);
  }
};

export { renderPartnerHome, renderPartnerProducts };
