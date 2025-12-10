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

// GET /profile/account
const renderAccountsDetails = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    const userData = user.get({ plain: true });
    
    return res.render('user/account', {
      title: 'Meu Perfil - Nexus Hub',
      activePage: 'profile',
      session: req.session,
      user: {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        data_nascimento: userData.data_nascimento ? new Date(userData.data_nascimento).toISOString().split('T')[0] : '',
        perfil: userData.perfil,
        criado_em: new Date(userData.criado_em).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    });
  } catch (err) {
    return next(err);
  }
};

// POST /profile/account/update
const updateAccountDetails = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    const { nome, email, data_nascimento } = req.body;

    // Validações básicas
    if (!nome || !email || !data_nascimento) {
      req.session.error = 'Todos os campos são obrigatórios.';
      return res.redirect('/profile/account');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).render('error/404', { title: '404 - Página Não Encontrada' });
    }

    // Verifica se o email já existe (exceto o do usuário atual)
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.session.error = 'Este email já está registrado.';
        return res.redirect('/profile/account');
      }
    }

    // Atualiza os dados do usuário
    await user.update({
      nome: nome.trim(),
      email: email.trim(),
      data_nascimento,
    });

    req.session.success = 'Perfil atualizado com sucesso!';
    return res.redirect('/profile/account');
  } catch (err) {
    return next(err);
  }
};

// GET /profile/orders
const renderOrdersHistory = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    // Busca todas as compras do usuário com itens e produtos
    const purchases = await Purchase.findAll({
      where: { cliente_id: userId },
      order: [['data_compra', 'DESC']],
      include: [
        {
          model: PurchaseItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'titulo', 'cover', 'slug'],
            },
          ],
        },
      ],
    });

    // Formata os pedidos para exibição
    const orders = purchases.map((purchase) => {
      const purchaseData = purchase.get({ plain: true });
      const items = purchaseData.items || [];

      return {
        id: purchaseData.id,
        data_compra: new Date(purchaseData.data_compra).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        data_compra_iso: purchaseData.data_compra,
        preco_total: Number(purchaseData.preco_total) || 0,
        status_pagamento: purchaseData.status_pagamento,
        status_label:
          purchaseData.status_pagamento === 'aprovado'
            ? 'Aprovado'
            : purchaseData.status_pagamento === 'pendente'
              ? 'Pendente'
              : 'Recusado',
        status_badge:
          purchaseData.status_pagamento === 'aprovado'
            ? 'success'
            : purchaseData.status_pagamento === 'pendente'
              ? 'warning'
              : 'danger',
        quantidade_itens: items.length,
        itens: items.map((item) => ({
          id: item.id,
          produto_id: item.produto_id,
          titulo: item.product?.titulo || 'Produto Indisponível',
          slug: item.product?.slug || '#',
          cover: item.product?.cover || 'https://placehold.co/80x100/1a1a1a/fff?text=IMG',
          preco_na_compra: Number(item.preco_na_compra) || 0,
          chave_revelada_em: item.chave_revelada_em,
        })),
      };
    });

    return res.render('user/orders', {
      title: 'Meus Pedidos - Nexus Hub',
      activePage: 'orders',
      session: req.session,
      orders,
      hasOrders: orders.length > 0,
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
  renderAccountsDetails,
  updateAccountDetails,
  renderOrdersHistory,
};
