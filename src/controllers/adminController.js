import {
  Product,
  Platform,
  Genre,
  Promotion,
  ProductKey,
  Purchase,
  PurchaseItem,
  User,
  Requirement,
} from '../models/index.js';

// util: estoque
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

// GET /dashboard/admin-test
const renderAdminHome = async (req, res, next) => {
  try {
    const [usersCount, productsCount, purchases] = await Promise.all([
      User.count(),
      Product.count(),
      Purchase.findAll({ include: [{ model: PurchaseItem, as: 'items' }] }),
    ]);

    const totalRevenue = purchases.reduce((acc, p) => acc + Number(p.preco_total || 0), 0);

    const kpis = [
      { label: 'Usuários', value: usersCount, icon: 'users', color: 'blue' },
      { label: 'Produtos', value: productsCount, icon: 'gamepad', color: 'purple' },
      { label: 'Receita', value: `R$ ${totalRevenue.toFixed(2)}`, icon: 'coins', color: 'green' },
    ];

    // Pendências/Usuários fictícios (placeholder)
    const pendingApprovals = [];
    const usersList = (await User.findAll({ limit: 10, order: [['id', 'DESC']] })).map((u) => ({
      nome: u.nome,
      email: u.email,
      tipo: u.perfil,
      status: u.status,
    }));

    // Promoções ativas
    const promos = await Promotion.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    const activePromotions = promos.map((pr) => ({
      title: pr.product?.titulo || 'Produto',
      product: pr.product?.titulo || '',
      discount: `${pr.percentual_desconto}%`,
    }));

    // carregar plataformas para o modal de categorias
    const platforms = await Platform.findAll({ order: [['nome', 'ASC']] });

    return res.render('dashboard/home', {
      layout: 'dashboard',
      title: 'Painel Admin',
      pageTitle: 'Visão Geral',
      activePage: 'home',
      userRole: 'admin',
      kpis,
      pendingApprovals,
      usersList,
      activePromotions,
      platforms: platforms.map((p) => p.get({ plain: true })), // adiciona aqui
      chartData: JSON.stringify({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{ label: 'Receita', data: [3, 6, 4, 9, 7, 12], borderColor: '#00d2d3' }],
      }),
    });
  } catch (err) {
    return next(err);
  }
};

// GET /dashboard/products (admin)
const renderAdminProducts = async (req, res, next) => {
  try {
    const [products, platforms, genres] = await Promise.all([
      Product.findAll({
        include: [
          { model: Platform, as: 'platform' },
          { model: Promotion, as: 'promotion' },
          { model: User, as: 'partner', attributes: ['nome'] },
          { model: Requirement, as: 'systemRequirements' }, // <- adicionar
        ],
        order: [['criado_em', 'DESC']],
      }),
      Platform.findAll(),
      Genre.findAll(),
    ]);

    // Promoções ativas
    const promos = await Promotion.findAll({
      include: [{ model: Product, as: 'product' }],
    });
    const activePromotions = promos.map((pr) => ({
      title: pr.product?.titulo || 'Produto',
      product: pr.product?.titulo || '',
      discount: `${pr.percentual_desconto}%`,
    }));

    const usersList = (await User.findAll({ limit: 10, order: [['id', 'DESC']] })).map((u) => ({
      nome: u.nome,
      email: u.email,
      tipo: u.perfil,
      status: u.status,
    }));

    const stocks = await computeStockFor(products);
    const stockMap = new Map(stocks.map((s) => [s.id, s.stock]));

    const productsView = products.map((p) => {
      const plain = p.get({ plain: true });
      return {
        id: plain.id,
        titulo: plain.titulo,
        slug: plain.slug,
        descricao: plain.descricao,
        plataforma: plain.platform?.nome || '-',
        plataforma_id: plain.plataforma_id, // <- necessário para setar o <select>
        preco: Number(plain.preco).toFixed(2),
        estoque: stockMap.get(plain.id) ?? 0,
        status: plain.status || 'ativo',
        imagem: plain.cover || 'https://placehold.co/80x100/1a1a1a/fff?text=IMG',
        parceiro: plain.partner?.nome || '—',
        // requisitos (nomes do model Requirement)
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
      pageTitle: 'Todos os Produtos',
      activePage: 'products',
      userRole: 'admin',
      activePromotions,
      products: productsView,
      usersList,
      platforms: platforms.map((x) => x.get({ plain: true })),
      genres: genres.map((x) => x.get({ plain: true })),
    });
  } catch (err) {
    return next(err);
  }
};

// GET /dashboard/categories
const renderCategories = async (req, res, next) => {
  try {
    const platforms = await Platform.findAll({ order: [['nome', 'ASC']] });
    return res.render('dashboard/categories', {
      layout: 'dashboard',
      title: 'Plataformas & Categorias',
      pageTitle: 'Plataformas',
      activePage: 'categories',
      userRole: 'admin',
      platforms: platforms.map((p) => p.get({ plain: true })),
    });
  } catch (err) {
    return next(err);
  }
};

// POST /dashboard/admin/categories/create
const createCategory = async (req, res, next) => {
  try {
    const { nome, slug } = req.body;
    if (!nome || !slug) return res.redirect('/dashboard/categories');
    await Platform.create({ nome, slug });
    return res.redirect('/dashboard/categories');
  } catch (err) {
    return next(err);
  }
};

// GET /dashboard/promotions
const renderPromotions = async (req, res, next) => {
  try {
    const [promos, products] = await Promise.all([
      Promotion.findAll({ include: [{ model: Product, as: 'product' }] }),
      Product.findAll({ attributes: ['id', 'titulo'], order: [['titulo', 'ASC']] }),
    ]);

    const promotions = promos.map((pr) => ({
      id: pr.id,
      produto_nome: pr.product?.titulo || 'Produto',
      percentual_desconto: pr.percentual_desconto,
      data_fim: pr.data_fim ? new Date(pr.data_fim).toLocaleDateString('pt-BR') : '-',
      ativa: pr.esta_ativo ?? true,
    }));

    return res.render('dashboard/promotions', {
      layout: 'dashboard',
      title: 'Promoções',
      pageTitle: 'Campanhas Promocionais',
      activePage: 'promotions',
      userRole: 'admin',
      promotions,
      products: products.map((p) => p.get({ plain: true })),
    });
  } catch (err) {
    return next(err);
  }
};

// POST /dashboard/promotions/create
const createPromotion = async (req, res, next) => {
  try {
    const { produto_id, percentual_desconto, data_inicio, data_fim } = req.body;
    if (!produto_id || !percentual_desconto) return res.redirect('/dashboard/promotions');
    await Promotion.create({
      produto_id,
      percentual_desconto: Number(percentual_desconto),
      data_inicio: data_inicio || new Date(),
      data_fim: data_fim || null,
      esta_ativo: true,
    });
    return res.redirect('/dashboard/promotions');
  } catch (err) {
    return next(err);
  }
};

export {
  renderAdminHome,
  renderAdminProducts,
  renderCategories,
  createCategory,
  renderPromotions,
  createPromotion,
};
