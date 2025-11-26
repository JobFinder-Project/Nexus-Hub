import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Promotion = sequelize.define(
    'Promotion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      percentual_desconto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      data_fim: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      esta_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: 'promocoes',
      timestamps: false,
    }
  );

  return Promotion;
};
