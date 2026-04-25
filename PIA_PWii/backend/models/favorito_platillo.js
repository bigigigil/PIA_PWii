const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritoPlatillo = sequelize.define('FavoritoPlatillo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  platillo_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Favoritos_Platillo',
  timestamps: true
});

module.exports = FavoritoPlatillo;