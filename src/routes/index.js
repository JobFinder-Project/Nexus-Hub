import express from 'express';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
const router = express.Router();

router.get('/', (req, res) => {
  // Dados simulados para testar o template
  const productsMock = [
    {
      titulo: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      preco: 199.90,
      imagem_url: '/img/Cyberpunk-foto.jpg', // Placeholder
      platform: { nome: 'PC' },
      promotion: { percentual_desconto: 70 }
    },
    {
      titulo: 'Elden Ring: Shadow of the Erdtree',
      slug: 'elden-ring-shadow-of-the-erdtree',
      preco: 349.90,
      imagem_url: '/img/Elden-Ring-Shadow-of-the-Erdtree.png', // Placeholder
      platform: { nome: 'PlayStation' },
      promotion: { percentual_desconto: 70 }
    },
    {
      titulo: 'Xbox Game Pass',
      slug: 'xbox-game-pass',
      preco: 49.90,
      imagem_url: '/img/GamePass.png', // Placeholder
      platform: { nome: 'Xbox' }
    }
  ];

  res.render('home', { 
    title: 'Nexus Hub - Home',
    activePage: 'home',
    products: productsMock
  });
});

router.get('/product/:slug', (req, res) => {
    const slug = req.params.slug;

    // Simulação de um produto vindo do banco
    const productMock = {
        id: 1,
        titulo: 'Elden Ring: Shadow of the Erdtree',
        slug: 'elden-ring',
        descricao: 'A expansão Shadow of the Erdtree apresenta uma nova história ambientada na Terra das Sombras, repleta de mistérios, masmorras perigosas e novos inimigos, armas e equipamentos.',
        preco: 349.90,
        plataforma: 'Steam', // Poderia ser um objeto
        tipo: 'Key', // Key ou Gift Card
        developer: 'FromSoftware',
        releaseDate: '2024-06-21',
        // Galeria de imagens
        images: [
            '/img/elden-ring-shadow-of-the-erdtree-wallpapers.jpg',
        ],
        cover: '/img/Elden-Ring-Shadow-of-the-Erdtree.png',
        // Promoção Ativa
        promotion: {
            percentual_desconto: 70,
            data_fim: new Date(Date.now() + 172800000).toISOString() // Expira em 2 dias (mock)
        },
        // Requisitos de Sistema
        requirements: {
            os: 'Windows 10/11',
            processor: 'Intel Core i7-8700K or AMD Ryzen 5 3600X',
            memory: '16 GB RAM',
            graphics: 'NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX VEGA 56 8GB',
            storage: '60 GB available space'
        }
    };

    res.render('catalog/product', {
        title: `${productMock.titulo} - Nexus Hub`,
        product: productMock,
        activePage: 'catalog'
    });
});


router.get('/cart', (req, res) => {
  // Simulação de itens no carrinho
  const cartItems = [
    {
      id: 1,
      titulo: 'Elden Ring: Shadow of the Erdtree',
      slug: 'elden-ring',
      cover: 'https://placehold.co/150x200/1a1a1a/FFF?text=Elden+Ring',
      plataforma: 'Steam',
      preco: 249.90,
      promotion: { percentual_desconto: 10 } // Simula 10% de desconto
    },
    {
      id: 2,
      titulo: 'God of War Ragnarok',
      slug: 'god-of-war',
      cover: 'https://placehold.co/150x200/2a2a2a/FFF?text=GOW',
      plataforma: 'PlayStation',
      preco: 299.90,
      promotion: null
    }
  ];

  // Cálculo simples do total para exibir
  let subtotal = 0;
  let descontoTotal = 0;

  cartItems.forEach(item => {
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
      total
    }
  });
});

router.use('/', authRoutes);
router.use('/', catalogRoutes);

export default router;
