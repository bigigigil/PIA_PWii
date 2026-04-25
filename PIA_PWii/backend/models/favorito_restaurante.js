const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritoRestaurante = sequelize.define('FavoritoRestaurante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  restaurante_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Favoritos_Usuario',
  timestamps: true
});

module.exports = FavoritoRestaurante;