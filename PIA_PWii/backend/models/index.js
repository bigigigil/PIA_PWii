const sequelize = require('../config/database');

const Usuario = require('./usuario');
const Sede = require('./sede');
const Restaurante = require('./restaurante');
const Platillo = require('./platillo');
const MenuRestaurante = require('./menu_restaurante');
const Categoria = require('./categoria');
const Pais = require('./pais');
const FavoritoRestaurante = require('./favorito_restaurante');
const Resena = require('./resena');
const FavoritoPlatillo = require('./favorito_platillo');
const FavoritoPais = require('./favorito_pais');


Restaurante.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' });
Sede.hasMany(Restaurante, { foreignKey: 'sede_id' });

Restaurante.belongsToMany(Platillo, { through: MenuRestaurante, foreignKey: 'restaurante_id', as: 'menu' });
Platillo.belongsToMany(Restaurante, { through: MenuRestaurante, foreignKey: 'platillo_id' });

Platillo.belongsTo(Pais, { foreignKey: 'pais_origen_id', as: 'pais' });
Platillo.belongsToMany(Categoria, { through: 'Platillo_Categoria', foreignKey: 'platillo_id', as: 'categorias' });
Categoria.belongsToMany(Platillo, { through: 'Platillo_Categoria', foreignKey: 'categoria_id' });
Pais.hasMany(Platillo, { foreignKey: 'pais_origen_id' });

Usuario.belongsTo(Pais, { foreignKey: 'pais_id', as: 'pais' });
Pais.hasMany(Usuario, { foreignKey: 'pais_id' });

Usuario.belongsToMany(Restaurante, { through: FavoritoRestaurante, foreignKey: 'usuario_id', as: 'restaurantesFavoritos' });
Restaurante.belongsToMany(Usuario, { through: FavoritoRestaurante, foreignKey: 'restaurante_id', as: 'seguidores' });

Restaurante.hasMany(Resena, { foreignKey: 'restaurante_id', as: 'resenas' });
Resena.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Usuario.hasMany(Resena, { foreignKey: 'usuario_id', as: 'resenas' });
Resena.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

Usuario.belongsToMany(Platillo, { through: FavoritoPlatillo, foreignKey: 'usuario_id', as: 'platillosFavoritos' });
Platillo.belongsToMany(Usuario, { through: FavoritoPlatillo, foreignKey: 'platillo_id', as: 'seguidores' });

Usuario.belongsToMany(Pais, { through: FavoritoPais, foreignKey: 'usuario_id', as: 'paisesFavoritos' });
Pais.belongsToMany(Usuario, { through: FavoritoPais, foreignKey: 'pais_id', as: 'seguidores' });

const db = {
    sequelize,
    Usuario,
    Sede,
    Restaurante,
    FavoritoRestaurante,
    Platillo,
    MenuRestaurante,
    Categoria,
    Pais,
    Resena,
    FavoritoPlatillo,
    FavoritoPais
};

module.exports = db;