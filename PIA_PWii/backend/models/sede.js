const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sede = sequelize.define('Sede', {
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Sedes_Mundial',
  timestamps: true 
});

module.exports = Sede;