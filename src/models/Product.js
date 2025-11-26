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
      url_imagem: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      requisitos_sistema: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING, // 'pendente_aprovacao', 'aprovado', 'rejeitado'
        defaultValue: 'pendente_aprovacao',
        allowNull: false,
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
