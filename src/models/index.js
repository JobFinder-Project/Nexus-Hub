import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 1. Importação dos definidores de Modelos (Factory Functions)
import createUserModel from './User.js';
import createPlatformModel from './Platform.js';
import createGenreModel from './Genre.js';
import createProductModel from './Product.js';
import createPurchaseModel from './Purchase.js';
import createPurchaseItemModel from './PurchaseItem.js';
import createProductKeyModel from './ProductKey.js';
import createPromotionModel from './Promotion.js';
import createRequirementModel from './Requirement.js';
import createGaleryModel from './Galery.js';

// 2. Inicialização dos Modelos
const User = createUserModel(sequelize, DataTypes);
const Platform = createPlatformModel(sequelize, DataTypes);
const Genre = createGenreModel(sequelize, DataTypes);
const Product = createProductModel(sequelize, DataTypes);
const Purchase = createPurchaseModel(sequelize, DataTypes);
const PurchaseItem = createPurchaseItemModel(sequelize, DataTypes);
const ProductKey = createProductKeyModel(sequelize, DataTypes);
const Promotion = createPromotionModel(sequelize, DataTypes);
const Requirement = createRequirementModel(sequelize, DataTypes);
const Galery = createGaleryModel(sequelize, DataTypes);

// 3. Definição das Associações (Relacionamentos)

// User <-> Product (Parceiro)
User.hasMany(Product, { foreignKey: 'parceiro_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'parceiro_id', as: 'partner' });

// Platform <-> Product
Platform.hasMany(Product, { foreignKey: 'plataforma_id', as: 'products' });
Product.belongsTo(Platform, { foreignKey: 'plataforma_id', as: 'platform' });

// User <-> Purchase (Cliente)
User.hasMany(Purchase, { foreignKey: 'cliente_id', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'cliente_id', as: 'client' });

// Purchase <-> PurchaseItem
Purchase.hasMany(PurchaseItem, { foreignKey: 'compra_id', as: 'items' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'compra_id', as: 'purchase' });

// Product <-> PurchaseItem
Product.hasMany(PurchaseItem, { foreignKey: 'produto_id', as: 'purchaseItems' });
PurchaseItem.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

// Product <-> ProductKey
Product.hasMany(ProductKey, { foreignKey: 'produto_id', as: 'keys' });
ProductKey.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

// PurchaseItem <-> ProductKey (Entrega da chave)
PurchaseItem.hasOne(ProductKey, { foreignKey: 'item_compra_id', as: 'deliveredKey' });
ProductKey.belongsTo(PurchaseItem, { foreignKey: 'item_compra_id', as: 'orderItem' });

// Product <-> Promotion
Product.hasOne(Promotion, { foreignKey: 'produto_id', as: 'promotion' });
Promotion.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

// Relação 1:1 com Requisitos
Product.hasOne(Requirement, {
  foreignKey: 'produto_id',
  sourceKey: 'id',
  as: 'systemRequirements',
  onDelete: 'CASCADE',
});
Requirement.belongsTo(Product, {
  foreignKey: 'produto_id',
  targetKey: 'id',
  as: 'product',
});

// Relação 1:N com ImagensGaleria
Product.hasMany(Galery, {
  foreignKey: 'produto_id',
  as: 'galleryImages',
  onDelete: 'CASCADE',
});
Galery.belongsTo(Product, {
  foreignKey: 'produto_id',
  as: 'product',
});

// Product <-> Genre (N:M)
Product.belongsToMany(Genre, {
  through: 'produto_generos',
  foreignKey: 'produto_id',
  otherKey: 'genero_id',
  as: 'genres',
});
Genre.belongsToMany(Product, {
  through: 'produto_generos',
  foreignKey: 'genero_id',
  otherKey: 'produto_id',
  as: 'products',
});

// 4. Exportação
// Exporta o objeto db como padrão e os modelos individualmente para facilitar imports
const db = {
  sequelize,
  Sequelize,
  User,
  Platform,
  Genre,
  Product,
  Purchase,
  PurchaseItem,
  ProductKey,
  Promotion,
  Requirement,
  Galery,
};

export {
  sequelize,
  User,
  Platform,
  Genre,
  Product,
  Purchase,
  PurchaseItem,
  ProductKey,
  Promotion,
  Requirement,
  Galery,
};

export default db;
