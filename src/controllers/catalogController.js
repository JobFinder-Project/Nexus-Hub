import { Product, Platform, Genre, Promotion } from '../models/index.js';

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

    return res.render('catalog/home', {
      title: 'Nexus Hub - Home',
      products: productsPlain,
      message,
      status,
    });
  } catch (err) {
    return next(err);
  }
};

const renderCatalog = async (req, res, next) => {
  try {
    const { message, status } = getSessionMessage(req);

    const products = await Product.findAll({
      order: [['criado_em', 'DESC']],
      include: [
        { model: Platform, as: 'platform' },
        { model: Genre, as: 'genres' },
        { model: Promotion, as: 'promotion' },
      ],
    });

    const productsPlain = products.map((p) => p.get({ plain: true }));

    return res.render('catalog/catalog', {
      title: 'Nexus Hub - Catálogo',
      products: productsPlain,
      message,
      status,
    });
  } catch (err) {
    return next(err);
  }
};

const renderCatalogByPlatform = async (req, res, next) => {
  try {
    const { platformSlug } = req.params;
    const platform = await Platform.findOne({ where: { slug: platformSlug } });

    if (!platform) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    const products = await Product.findAll({
      where: { plataforma_id: platform.id },
      include: [
        { model: Platform, as: 'platform' },
        { model: Genre, as: 'genres' },
        { model: Promotion, as: 'promotion' },
      ],
      order: [['criado_em', 'DESC']],
    });

    const productsPlain = products.map((p) => p.get({ plain: true }));

    return res.render('catalog/catalog', {
      title: `Catálogo - ${platform.nome}`,
      products: productsPlain,
      filter: {
        type: 'platform',
        platform: platform.get ? platform.get({ plain: true }) : platform,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const renderCatalogByGenre = async (req, res, next) => {
  try {
    const { genreSlug } = req.params;
    const genre = await Genre.findOne({ where: { slug: genreSlug } });

    if (!genre) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    // usando a associação N:M — getProducts retorna instâncias
    const products = await genre.getProducts({
      include: [
        { model: Platform, as: 'platform' },
        { model: Promotion, as: 'promotion' },
        { model: Genre, as: 'genres' }, // garante que cada produto contenha seu array de genres
      ],
      order: [['criado_em', 'DESC']],
    });

    const productsPlain = products.map((p) => p.get({ plain: true }));

    return res.render('catalog/catalog', {
      title: `Catálogo - ${genre.nome}`,
      products: productsPlain,
      filter: { type: 'genre', genre: genre.get ? genre.get({ plain: true }) : genre },
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

    return res.render('catalog/product-details', {
      title: productPlain.titulo,
      product: productPlain,
    });
  } catch (err) {
    return next(err);
  }
};

export {
  renderHome,
  renderCatalog,
  renderCatalogByPlatform,
  renderCatalogByGenre,
  renderProductDetails,
};
