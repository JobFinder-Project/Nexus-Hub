module.exports = (sequelize, DataTypes) => {
    
  const PurchaseItem = sequelize.define('PurchaseItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    compra_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preco_na_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    chave_revelada_em: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'itens_compra',
    timestamps: false
  });

  return PurchaseItem;
};