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
        tipo: plain.tipo,
        sistema: plain.sistema,
        data_lancamento: plain.data_lancamento,
        desenvolvedor: plain.desenvolvedor,
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

// POST /dashboard/partner/promotions/create
const createPromotion = async (req, res, next) => {
  try {
    const partnerId = req.session.userId;
    const { produto_id, percentual_desconto, data_inicio, data_fim } = req.body;

    if (!produto_id || !percentual_desconto) {
      return res.redirect('/dashboard/partner');
    }

    // valida que o produto pertence ao parceiro
    const product = await Product.findOne({
      where: { id: produto_id, parceiro_id: partnerId },
      attributes: ['id', 'parceiro_id', 'titulo'],
    });
    if (!product) {
      // produto não pertence ao parceiro
      return res.status(403).render('error/500', {
        title: '500 - Erro Interno do Servidor',
        message: 'Você não pode criar promoção para produtos de outros parceiros.',
        stack: null,
      });
    }

    // parse seguro das datas (YYYY-MM-DD do input date)
    const parseDateOrNull = (str) => {
      if (!str) return null;
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    };
    const inicio = parseDateOrNull(data_inicio) || new Date(); // default: agora
    const fim = parseDateOrNull(data_fim); // pode ser null (promo sem fim)

    await Promotion.create({
      produto_id: product.id,
      percentual_desconto: Number(percentual_desconto),
      data_inicio: inicio,
      data_fim: fim,
      esta_ativo: true,
    });

    return res.redirect('/dashboard/partner');
  } catch (err) {
    return next(err);
  }
};

// POST /partner/products/create
const createProduct = async (req, res, next) => {
  try {
    const partnerId = req.session.userId;
    const {
      titulo,
      descricao,
      slug,
      plataforma_id,
      generos,
      classificacao,
      preco,
      url_imagem,
      req_os,
      req_cpu,
      req_ram,
      req_gpu,
      req_armazenamento,
      tipo,
      sistema,
      data_lancamento,
      desenvolvedor,
    } = req.body;

    // validação mínima
    if (!titulo || !slug || !plataforma_id || !preco) {
      return res.redirect('/dashboard/partner/products');
    }

    // normaliza gêneros (array de IDs)
    const genreIds = Array.isArray(generos)
      ? generos.map((g) => Number(g)).filter(Boolean)
      : generos
        ? [Number(generos)].filter(Boolean)
        : [];

    // criar produto
    const newProduct = await Product.create({
      titulo,
      descricao: descricao || null,
      slug,
      plataforma_id: Number(plataforma_id),
      classificacao: classificacao || 'Livre',
      preco: Number(preco),
      parceiro_id: partnerId,
      cover: url_imagem || null,
      tipo: tipo || null,
      sistema: sistema || null,
      data_lancamento: data_lancamento ? new Date(data_lancamento) : null,
      desenvolvedor: desenvolvedor || null,
      status: 'ativo',
    });

    // associa gêneros (se N:M estiver configurado como Product.belongsToMany(Genre, { as: 'genres', ... }))
    if (genreIds.length && typeof newProduct.setGenres === 'function') {
      await newProduct.setGenres(genreIds);
    }

    // requisitos de sistema
    await Requirement.create({
      produto_id: newProduct.id,
      os: req_os || null,
      processador: req_cpu || null,
      memoria: req_ram || null,
      graficos: req_gpu || null,
      armazenamento: req_armazenamento || null,
    });

    return res.redirect('/dashboard/partner/products');
  } catch (err) {
    return next(err);
  }
};

// POST /partner/products/update
const updateProduct = async (req, res, next) => {
  try {
    const partnerId = req.session.userId;
    const {
      id, // hidden input
      titulo,
      descricao,
      slug,
      plataforma_id,
      generos, // pode vir string ou array
      classificacao,
      preco,
      url_imagem,
      req_os,
      req_cpu,
      req_ram,
      req_gpu,
      req_armazenamento,
      tipo,
      sistema,
      data_lancamento,
      desenvolvedor,
      status,
    } = req.body;

    const productId = Number(id);
    if (!productId) return res.redirect('/dashboard/partner/products');

    // validação mínima
    if (!titulo || !slug || !plataforma_id || !preco) {
      return res.redirect('/dashboard/partner/products');
    }

    // garantir que o produto pertence ao parceiro
    const product = await Product.findOne({
      where: { id: productId, parceiro_id: partnerId },
      include: [{ model: Requirement, as: 'systemRequirements' }],
    });
    if (!product) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    // saneamento de enumerados
    const allowedTipos = new Set(['jogo', 'software', 'gift card']);
    const allowedSistemas = new Set(['windows', 'android', 'ios', 'linux']);

    // atualizar produto
    await product.update({
      titulo,
      descricao: descricao || null,
      slug,
      plataforma_id: Number(plataforma_id),
      classificacao: classificacao || 'Livre',
      preco: Number(preco),
      cover: url_imagem || null,
      tipo: allowedTipos.has((tipo || '').toLowerCase()) ? tipo.toLowerCase() : product.tipo,
      sistema: allowedSistemas.has((sistema || '').toLowerCase())
        ? sistema.toLowerCase()
        : product.sistema,
      data_lancamento: data_lancamento ? new Date(data_lancamento) : product.data_lancamento,
      desenvolvedor: desenvolvedor || product.desenvolvedor,
    });

    // atualizar gêneros (N:M)
    const genreIds = Array.isArray(generos)
      ? generos.map((g) => Number(g)).filter(Boolean)
      : generos
        ? [Number(generos)].filter(Boolean)
        : [];
    if (typeof product.setGenres === 'function') {
      await product.setGenres(genreIds); // limpa se vazio
    }

    // upsert requisitos de sistema
    const reqBody = {
      os: req_os || null,
      processador: req_cpu || null,
      memoria: req_ram || null,
      graficos: req_gpu || null,
      armazenamento: req_armazenamento || null,
    };

    if (product.systemRequirements) {
      await product.systemRequirements.update(reqBody);
    } else {
      await Requirement.create({ produto_id: product.id, ...reqBody });
    }

    return res.redirect('/dashboard/partner/products');
  } catch (err) {
    return next(err);
  }
};

export { renderPartnerHome, renderPartnerProducts, createPromotion, createProduct, updateProduct };
