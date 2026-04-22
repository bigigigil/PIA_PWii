const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurante = sequelize.define('Restaurante', {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  sede_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Restaurantes',
  timestamps: true
});

module.exports = Restaurante;