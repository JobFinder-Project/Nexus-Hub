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
      id: pr.id,
      title: pr.product?.titulo || 'Produto',
      product: pr.product?.titulo || '',
      discount: `${pr.percentual_desconto}%`,
      ativo: pr.esta_ativo,
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
      id: pr.id,
      title: pr.product?.titulo || 'Produto',
      product: pr.product?.titulo || '',
      discount: `${pr.percentual_desconto}%`,
      ativo: pr.esta_ativo,
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
        tipo: plain.tipo,
        sistema: plain.sistema,
        data_lancamento: plain.data_lancamento,
        desenvolvedor: plain.desenvolvedor,
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

// POST /dashboard/admin/categories/create
const createPlataform = async (req, res, next) => {
  try {
    const { nome, slug } = req.body;
    if (!nome || !slug) return res.redirect('/dashboard/categories');
    await Platform.create({ nome, slug });
    return res.redirect('/dashboard/admin');
  } catch (err) {
    return next(err);
  }
};

// POST /admin/promotions/delete/:promotionId
const deletePromotion = async (req, res, next) => {
  try {
    const { promotionId } = req.params;
    if (!promotionId) return res.redirect('/dashboard/admin');

    const promotion = await Promotion.findByPk(promotionId);
    if (!promotion) return res.redirect('/dashboard/admin');

    await promotion.destroy();
    return res.redirect('/dashboard/admin');
  } catch (err) {
    return next(err);
  }
};

// POST /admin/products/create
const createProduct = async (req, res, next) => {
  try {
    const adminId = req.session.userId;
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

    if (!titulo || !slug || !plataforma_id || !preco) {
      return res.redirect('/dashboard/admin/products');
    }

    // normaliza gêneros (array de IDs)
    const genreIds = Array.isArray(generos)
      ? generos.map((g) => Number(g)).filter(Boolean)
      : generos
        ? [Number(generos)].filter(Boolean)
        : [];

    const newProduct = await Product.create({
      titulo,
      descricao: descricao || null,
      slug,
      plataforma_id: Number(plataforma_id),
      classificacao: classificacao || 'Livre',
      preco: Number(preco),
      parceiro_id: adminId,
      cover: url_imagem || null,
      tipo: tipo || null,
      sistema: sistema || null,
      data_lancamento: data_lancamento ? new Date(data_lancamento) : null,
      desenvolvedor: desenvolvedor || null,
      status: 'pendente_aprovacao',
    });

    // associa gêneros (se N:M estiver configurado como Product.belongsToMany(Genre, { as: 'genres', ... }))
    if (genreIds.length && typeof newProduct.setGenres === 'function') {
      await newProduct.setGenres(genreIds);
    }

    // requisitos de sistema (se fornecidos)
    if (req_os || req_cpu || req_ram || req_gpu || req_armazenamento) {
      await Requirement.create({
        produto_id: newProduct.id,
        os: req_os || null,
        processador: req_cpu || null,
        memoria: req_ram || null,
        graficos: req_gpu || null,
        armazenamento: req_armazenamento || null,
      });
    }

    return res.redirect('/dashboard/admin/products');
  } catch (err) {
    return next(err);
  }
};

export { renderAdminHome, renderAdminProducts, createPlataform, deletePromotion, createProduct };
