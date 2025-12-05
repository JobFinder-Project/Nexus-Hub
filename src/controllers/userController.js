import {
  Product,
  Platform,
  Promotion,
  Purchase,
  PurchaseItem,
  ProductKey,
  User,
} from '../models/index.js';

// Helpers internos
const ensureCart = (req) => {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
};

// Carrega produtos do carrinho e monta itens para as views
const loadCartItems = async (productIds) => {
  if (!productIds.length) return [];

  const products = await Product.findAll({
    where: { id: productIds },
    include: [
      { model: Platform, as: 'platform' },
      { model: Promotion, as: 'promotion' },
    ],
  });

  // mantém a ordem do carrinho
  const mapById = new Map(products.map((p) => [p.id, p]));
  const items = productIds
    .map((id) => mapById.get(Number(id)))
    .filter(Boolean)
    .map((p) => {
      const plain = p.get({ plain: true });
      const preco = Number(plain.preco) || 0;
      const desconto = plain.promotion ? Number(plain.promotion.percentual_desconto) || 0 : 0;
      return {
        id: plain.id,
        titulo: plain.titulo,
        imagem:
          plain.cover || plain.imagem_url || 'https://placehold.co/300x400/1a1a1a/FFF?text=GAME',
        plataforma: plain.platform?.nome || '?',
        preco,
        desconto, // usado pelo template para calcular preço final
        slug: plain.slug,
      };
    });

  return items;
};

const summarizeCart = (cartItems) => {
  const subtotal = cartItems.reduce((acc, it) => acc + (Number(it.preco) || 0), 0);
  const descontoTotal = cartItems.reduce((acc, it) => {
    const p = Number(it.preco) || 0;
    const d = Number(it.desconto) || 0;
    return acc + (d > 0 ? p * (d / 100) : 0);
  }, 0);
  const total = subtotal - descontoTotal;

  return { subtotal, discount: descontoTotal, total };
};

// GET /cart
const renderCart = async (req, res, next) => {
  try {
    const cart = ensureCart(req);
    const cartItems = await loadCartItems(cart);
    const summary = summarizeCart(cartItems);

    return res.render('user/cart', {
      title: 'Meu Carrinho - Nexus Hub',
      activePage: 'cart',
      session: req.session,
      cartItems,
      summary,
    });
  } catch (err) {
    return next(err);
  }
};

// POST /cart/add/:productId
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }
    const cart = ensureCart(req);
    cart.push(Number(productId));
    return res.redirect('/cart');
  } catch (err) {
    return next(err);
  }
};

// POST /cart/remove/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = ensureCart(req);
    const idNum = Number(productId);
    req.session.cart = cart.filter((id) => id !== idNum);
    return res.redirect('/cart');
  } catch (err) {
    return next(err);
  }
};

// GET /checkout
const renderCheckout = async (req, res, next) => {
  try {
    const cart = ensureCart(req);
    if (!cart.length) return res.redirect('/cart');

    const cartItems = await loadCartItems(cart);
    const summary = summarizeCart(cartItems);

    // Dados do usuário autenticado (mínimos usados no template)
    const user = await User.findByPk(req.session.userId);

    const selectedMethod = req.query.payment || 'pix';

    return res.render('user/checkout', {
      title: 'Finalizar Pedido - Nexus Hub',
      activePage: 'cart',
      session: req.session,
      user,
      selectedMethod,
      cartItems,
      summary,
    });
  } catch (err) {
    return next(err);
  }
};

// POST /checkout
const processCheckout = async (req, res, next) => {
  const t = await Purchase.sequelize.transaction();
  try {
    const cart = ensureCart(req);
    if (!cart.length) return res.redirect('/cart');

    const cartItems = await loadCartItems(cart);
    const summary = summarizeCart(cartItems);

    const userId = req.session.userId;
    // cria a compra
    const purchase = await Purchase.create(
      {
        cliente_id: userId,
        preco_total: summary.total,
        status_pagamento: 'aprovado', // ou 'pendente' conforme o meio de pagamento
      },
      { transaction: t }
    );

    // cria itens da compra
    for (const it of cartItems) {
      const item = await PurchaseItem.create(
        {
          compra_id: purchase.id,
          produto_id: it.id,
          preco_na_compra:
            Number(it.desconto) > 0 ? it.preco - it.preco * (it.desconto / 100) : it.preco,
        },
        { transaction: t }
      );

      // tenta alocar uma chave disponível para o item (estoque)
      const availableKey = await ProductKey.findOne({
        where: { produto_id: it.id, foi_vendida: false, item_compra_id: null },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (availableKey) {
        availableKey.item_compra_id = item.id;
        availableKey.foi_vendida = true;
        await availableKey.save({ transaction: t });
      }
    }

    await t.commit();

    // limpa o carrinho e redireciona para página de sucesso
    req.session.cart = [];
    return res.render('user/success', {
      title: 'Pedido Concluído - Nexus Hub',
      session: req.session,
      pageDetails: {
        icon: 'check-circle',
        title: 'Pagamento Aprovado!',
        message:
          'Seu pedido foi processado com sucesso. As chaves estão disponíveis na sua biblioteca.',
        colorClass: 'approved',
      },
      orderId: purchase.id,
      status: 'approved',
    });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
};

// GET /library
const renderLibrary = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    // Compras e itens do usuário, com produto e chave entregue
    const purchases = await Purchase.findAll({
      where: { cliente_id: userId },
      order: [['id', 'DESC']],
      include: [
        {
          model: PurchaseItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [{ model: Platform, as: 'platform' }],
            },
            { model: ProductKey, as: 'deliveredKey' },
          ],
        },
      ],
    });

    const games = [];
    for (const p of purchases) {
      for (const item of p.items) {
        const it = item.get({ plain: true });
        const prod = it.product;
        const status = p.status_pagamento === 'aprovado' ? 'active' : 'pending';

        games.push({
          id: it.id,
          titulo: prod?.titulo || 'Produto',
          plataforma: prod?.platform?.nome || 'PC',
          imagem: prod?.cover || 'https://placehold.co/300x400/1a1a1a/FFF?text=GAME',
          data_compra: new Date(p.data_compra).toLocaleDateString('pt-BR'),
          status,
          key_revealed: Boolean(it.deliveredKey && status === 'active'),
          key_code: it.deliveredKey?.valor_chave || '',
        });
      }
    }

    return res.render('user/library', {
      title: 'Minha Biblioteca - Nexus Hub',
      activePage: 'library',
      session: req.session,
      games,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /library/keys/:purchaseId (opcional: exibir detalhes de chaves de uma compra)
const displayKeys = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { purchaseId } = req.params;

    const purchase = await Purchase.findOne({
      where: { id: purchaseId, cliente_id: userId },
      include: [
        {
          model: PurchaseItem,
          as: 'items',
          include: [
            { model: ProductKey, as: 'deliveredKey' },
            { model: Product, as: 'product' },
          ],
        },
      ],
    });

    if (!purchase) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    // Reaproveita a biblioteca para listar apenas os itens desta compra
    const games = purchase.items.map((it) => {
      const plain = it.get({ plain: true });
      const prod = plain.product;
      const status = purchase.status_pagamento === 'aprovado' ? 'active' : 'pending';
      return {
        id: plain.id,
        titulo: prod?.titulo || 'Produto',
        plataforma: prod?.platform?.nome || 'PC',
        imagem: prod?.cover || 'https://placehold.co/300x400/1a1a1a/FFF?text=GAME',
        data_compra: new Date(purchase.data_compra).toLocaleDateString('pt-BR'),
        status,
        key_revealed: Boolean(plain.deliveredKey && status === 'active'),
        key_code: plain.deliveredKey?.valor_chave || '',
      };
    });

    return res.render('user/library', {
      title: `Chaves do Pedido #${purchase.id} - Nexus Hub`,
      activePage: 'library',
      session: req.session,
      games,
    });
  } catch (err) {
    return next(err);
  }
};

export {
  renderCart,
  addToCart,
  removeFromCart,
  renderCheckout,
  processCheckout,
  renderLibrary,
  displayKeys,
};
