module.exports = (sequelize, DataTypes) => {
    
  const Platform = sequelize.define('Platform', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'plataformas',
    timestamps: false
  });

  return Platform;
};