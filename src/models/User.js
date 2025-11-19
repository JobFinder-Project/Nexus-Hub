module.exports = (sequelize, DataTypes) => {
    
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    perfil: {
      type: DataTypes.STRING, // 'cliente', 'parceiro', 'admin'
      defaultValue: 'cliente',
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ativo',
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return User;
};