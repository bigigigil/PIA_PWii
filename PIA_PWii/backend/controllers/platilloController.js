const { Platillo } = require('../models');

exports.obtenerTodos = async (req, res) => {
    try {
        const platillos = await Platillo.findAll({
            attributes: ['id', 'nombre']
        });
        res.status(200).json(platillos);
    } catch (error) {
        console.error('Error al obtener platillos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};