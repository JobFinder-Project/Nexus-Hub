const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
    host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        port: process.env.DB_PORT,
        pool: {
            max: 10, // número máximo de conexões no pool
            min: 0, // número mínimo de conexões no pool
            acquire: 30000, // tempo máximo para obter conexão (ms)
            idle: 10000,    // tempo antes de liberar conexão ociosa (ms)
            evict: 1000 // tempo para verificar conexões ociosas (ms)
        },
    }
);

module.exports = sequelize;