const sequelize = require('../config/database');

const Usuario = require('./usuario');
const Sede = require('./sede');
const Categoria = require('./categoria');
const Restaurante = require('./restaurante');

Restaurante.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' });
Sede.hasMany(Restaurante, { foreignKey: 'sede_id' });

const db = {
  sequelize,
  Usuario,
  Sede,
  Categoria,
  Restaurante
};

module.exports = db;