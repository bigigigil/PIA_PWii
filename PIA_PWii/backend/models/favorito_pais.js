const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritoPais = sequelize.define('FavoritoPais', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pais_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Favoritos_Pais',
  timestamps: true
});

module.exports = FavoritoPais;