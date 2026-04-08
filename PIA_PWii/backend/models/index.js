const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize('hogaranza_pwii', 'root', 'young.KDAY6rati', {
    host: 'localhost',
    dialect: 'mysql',
    logging: msg => logger.info(msg),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require('./Usuario')(sequelize, Sequelize);

module.exports = db;