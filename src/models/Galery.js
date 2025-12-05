import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Galery = sequelize.define(
    'Galery',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Chave estrangeira que referencia a tabela 'produtos'
      },
      url: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
    },
    {
      tableName: 'imagens_galeria',
      timestamps: false,
    }
  );

  return Galery;
};
