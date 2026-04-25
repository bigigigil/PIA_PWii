const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuRestaurante = sequelize.define('MenuRestaurante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'Menu_Restaurante',
  timestamps: true
});

module.exports = MenuRestaurante;