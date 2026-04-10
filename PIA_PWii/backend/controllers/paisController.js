const Pais = require('../models/pais');

exports.obtenerPaises = async (req, res) => {
    try {
        
        const paises = await Pais.findAll({
            order: [['nombre', 'ASC']] 
        });
        
        res.status(200).json(paises);
    } catch (error) {
        console.error("Error al obtener países:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
};