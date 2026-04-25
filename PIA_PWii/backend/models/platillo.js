const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Platillo = sequelize.define('Platillo', {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pais_origen_id: { 
    type: DataTypes.INTEGER,
    allowNull: true 
  }
}, {
  tableName: 'Platillos',
  timestamps: true
});

module.exports = Platillo;