import { DataTypes } from 'sequelize';

export default (sequelize) => {

  const Purchase = sequelize.define('Purchase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_compra: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    preco_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status_pagamento: {
      type: DataTypes.STRING, // 'pendente', 'aprovado', 'recusado'
      defaultValue: 'pendente',
      allowNull: false
    }
  }, {
    tableName: 'compras',
    timestamps: false 
  });

  return Purchase;
};