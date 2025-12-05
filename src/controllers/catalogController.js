import { Product, Platform, Genre, Promotion, Requirement, Galery } from '../models/index.js';

const getSessionMessage = (req) => {
  let message = null;
  let status = null;
  if (req.session && req.session.message) {
    message = req.session.message;
    status = req.session.status;
    req.session.message = null;
    req.session.status = null;
  }
  return { message, status };
};

const renderHome = async (req, res, next) => {
  try {
    const { message, status } = getSessionMessage(req);

    const products = await Product.findAll({
      limit: 8,
      order: [['criado_em', 'DESC']],
      include: [
        { model: Platform, as: 'platform' },
        { model: Genre, as: 'genres' },
        { model: Promotion, as: 'promotion' },
      ],
    });

    // converte instâncias Sequelize para objetos plain (JSON) — facilita o consumo no Handlebars
    const productsPlain = products.map((p) => p.get({ plain: true }));

    return res.render('home', {
      title: 'Nexus Hub - Home',
      products: productsPlain,
      activePage: 'home',
      session: req.session,
    });
  } catch (err) {
    return next(err);
  }
};

const renderCatalog = async (req, res, next) => {
  try {
    const { message, status } = getSessionMessage(req);

    const filters = {
      platform: req.query.platform || '',
      genre: req.query.genre || '',
      system: req.query.system || '',
      type: req.query.type || '',
      sort: req.query.sort || 'relevance',
    };

    // normaliza tipo (aceita 'game' -> 'jogo', ou já o valor em pt)
    const typeMap = { game: 'jogo', software: 'software', 'gift card': 'gift card' };
    const tipoValue = filters.type ? typeMap[filters.type] || filters.type : null;

    const where = {};
    if (filters.system) where.sistema = filters.system;
    if (tipoValue) where.tipo = tipoValue;

    const include = [
      { model: Platform, as: 'platform' },
      { model: Genre, as: 'genres' },
      { model: Promotion, as: 'promotion' },
    ];

    if (filters.platform) {
      include[0].where = { slug: filters.platform };
      include[0].required = true;
    }

    if (filters.genre) {
      include[1].where = { slug: filters.genre };
      include[1].required = true;
    }

    let order = [['criado_em', 'DESC']];
    switch (filters.sort) {
      case 'price_asc':
        order = [['preco', 'ASC']];
        break;
      case 'price_desc':
        order = [['preco', 'DESC']];
        break;
      case 'newest':
        order = [['criado_em', 'DESC']];
        break;
      default:
        order = [['criado_em', 'DESC']];
    }

    const products = await Product.findAll({
      where,
      order,
      include,
    });

    const productsPlain = products.map((p) => p.get({ plain: true }));

    return res.render('catalog/index', {
      title: 'Nexus Hub - Catálogo',
      products: productsPlain,
      activePage: 'catalog',
      session: req.session,
      filters,
      message,
      status,
    });
  } catch (err) {
    return next(err);
  }
};

const renderProductDetails = async (req, res, next) => {
  try {
    const { productSlug } = req.params;

    const product = await Product.findOne({
      where: { slug: productSlug },
      include: [
        { model: Platform, as: 'platform' },
        { model: Genre, as: 'genres' },
        { model: Promotion, as: 'promotion' },
        { model: Requirement, as: 'systemRequirements' },
        { model: Galery, as: 'galleryImages' },
      ],
    });

    if (!product) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    const productPlain = product.get({ plain: true });

    // no template usamos product.genres como array — map não é necessário aqui, mas deixamos pronto
    if (!Array.isArray(productPlain.genres)) {
      productPlain.genres = productPlain.genres ? [productPlain.genres] : [];
    }
    if (!Array.isArray(productPlain.imagens_galeria)) {
      productPlain.imagens_galeria = productPlain.imagens_galeria
        ? [productPlain.imagens_galeria]
        : [];
    }

    return res.render('catalog/product', {
      title: productPlain.titulo,
      product: productPlain,
      session: req.session,
      activePage: 'catalog',
    });
  } catch (err) {
    return next(err);
  }
};

export { renderHome, renderCatalog, renderProductDetails };
