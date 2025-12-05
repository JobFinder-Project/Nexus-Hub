import express from 'express';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
const router = express.Router();

router.get('/cart', (req, res) => {
  // Simulação de itens no carrinho
  const cartItems = [
    {
      id: 1,
      titulo: 'Elden Ring: Shadow of the Erdtree',
      slug: 'elden-ring',
      cover: 'https://placehold.co/150x200/1a1a1a/FFF?text=Elden+Ring',
      plataforma: 'Steam',
      preco: 249.9,
      promotion: { percentual_desconto: 10 }, // Simula 10% de desconto
    },
    {
      id: 2,
      titulo: 'God of War Ragnarok',
      slug: 'god-of-war',
      cover: 'https://placehold.co/150x200/2a2a2a/FFF?text=GOW',
      plataforma: 'PlayStation',
      preco: 299.9,
      promotion: null,
    },
  ];

  // Cálculo simples do total para exibir
  let subtotal = 0;
  let descontoTotal = 0;

  cartItems.forEach((item) => {
    let price = item.preco;
    subtotal += price;
    if (item.promotion) {
      descontoTotal += price * (item.promotion.percentual_desconto / 100);
    }
  });

  const total = subtotal - descontoTotal;

  res.render('cart', {
    title: 'Meu Carrinho - Nexus Hub',
    activePage: 'cart',
    cartItems,
    summary: {
      subtotal,
      discount: descontoTotal,
      total,
    },
  });
});

router.use('/', authRoutes);
router.use('/', catalogRoutes);

export default router;
