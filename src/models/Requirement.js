import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Requirement = sequelize.define(
    'Requirement',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Chave estrangeira para o Produto (garante a relação 1:1)
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Garante que apenas um registro exista por produto
      },
      os: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      processador: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      memoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      graficos: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      armazenamento: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: 'requisitos',
      timestamps: false, // Sem colunas createdAt/updatedAt
    }
  );

  return Requirement;
};
