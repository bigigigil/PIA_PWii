const sequelize = require('../config/database');

const Usuario = require('./usuario');
const Sede = require('./sede');
const Restaurante = require('./restaurante');
const Platillo = require('./platillo');
const MenuRestaurante = require('./menu_restaurante');
const Categoria = require('./categoria');
const Pais = require('./pais');

Restaurante.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' });
Sede.hasMany(Restaurante, { foreignKey: 'sede_id' });

Restaurante.belongsToMany(Platillo, {
    through: MenuRestaurante,
    foreignKey: 'restaurante_id',
    as: 'menu'
});

Platillo.belongsToMany(Restaurante, {
    through: MenuRestaurante,
    foreignKey: 'platillo_id'
});

Platillo.belongsTo(Pais, { foreignKey: 'pais_origen_id', as: 'pais' });

const db = {
    sequelize,
    Usuario,
    Sede,
    Restaurante,
    Platillo,
    MenuRestaurante,
    Categoria,
    Pais
};

module.exports = db;