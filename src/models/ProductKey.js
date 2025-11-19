module.exports = (sequelize, DataTypes) => {

  const ProductKey = sequelize.define('ProductKey', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_compra_id: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    valor_chave: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    foi_vendida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'chaves_produto',
    timestamps: false 
  });

  return ProductKey;
};