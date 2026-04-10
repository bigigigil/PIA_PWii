const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pais = require('./pais');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    pais_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Usuarios',
    timestamps: true 
});

Usuario.belongsTo(Pais, { foreignKey: 'pais_id' });


module.exports = Usuario;