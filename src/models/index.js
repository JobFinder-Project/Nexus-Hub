const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Platform = require('./Platform')(sequelize, DataTypes);
const Genre = require('./Genre')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Purchase = require('./Purchase')(sequelize, DataTypes);
const PurchaseItem = require('./PurchaseItem')(sequelize, DataTypes);
const ProductKey = require('./ProductKey')(sequelize, DataTypes);
const Promotion = require('./Promotion')(sequelize, DataTypes);

User.hasMany(Product, { foreignKey: 'parceiro_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'parceiro_id', as: 'partner' });

Platform.hasMany(Product, { foreignKey: 'plataforma_id', as: 'products' });
Product.belongsTo(Platform, { foreignKey: 'plataforma_id', as: 'platform' });

User.hasMany(Purchase, { foreignKey: 'cliente_id', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'cliente_id', as: 'client' });

Purchase.hasMany(PurchaseItem, { foreignKey: 'compra_id', as: 'items' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'compra_id', as: 'purchase' });

Product.hasMany(PurchaseItem, { foreignKey: 'produto_id', as: 'purchaseItems' });
PurchaseItem.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

Product.hasMany(ProductKey, { foreignKey: 'produto_id', as: 'keys' });
ProductKey.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

PurchaseItem.hasOne(ProductKey, { foreignKey: 'item_compra_id', as: 'deliveredKey' });
ProductKey.belongsTo(PurchaseItem, { foreignKey: 'item_compra_id', as: 'orderItem' });

Product.hasOne(Promotion, { foreignKey: 'produto_id', as: 'promotion' });
Promotion.belongsTo(Product, { foreignKey: 'produto_id', as: 'product' });

Product.belongsToMany(Genre, { 
  through: 'produto_generos', 
  foreignKey: 'produto_id',
  otherKey: 'genero_id',
  as: 'genres'
});
Genre.belongsToMany(Product, { 
  through: 'produto_generos', 
  foreignKey: 'genero_id',
  otherKey: 'produto_id',
  as: 'products'
});


module.exports = {
  sequelize,
  User,
  Platform,
  Genre,
  Product,
  Purchase,
  PurchaseItem,
  ProductKey,
  Promotion
};