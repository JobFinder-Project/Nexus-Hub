import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      parceiro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plataforma_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      classificacao_etaria: {
        type: DataTypes.STRING,
        defaultValue: 'Livre',
        allowNull: false,
      },
      cover: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING, // 'pendente_aprovacao', 'aprovado', 'rejeitado'
        defaultValue: 'pendente_aprovacao',
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING(50), // jogo, software ou gift card
        defaultValue: 'jogo',
        allowNull: false,
      },
      requisitos_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Pode ser NULL se for um produto de console ou gift card
        unique: true,
      },
      desenvolvedor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_lancamento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sistema: {
        type: DataTypes.STRING, // windows, android, ios
        allowNull: true,
      },
    },
    {
      tableName: 'produtos',
      timestamps: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em',
    }
  );

  return Product;
};
