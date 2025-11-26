import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Genre = sequelize.define(
    'Genre',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'generos',
      timestamps: false,
    }
  );

  return Genre;
};
