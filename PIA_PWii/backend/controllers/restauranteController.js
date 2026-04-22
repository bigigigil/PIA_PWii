const { Restaurante, Usuario } = require('../models');
const crearRestaurante = async (req, res) => {
    try {
        const { nombre, latitud, longitud,sede_id } = req.body;

        const nuevoRestaurante = await Restaurante.create({
            nombre,
            latitud,
            longitud,
            sede_id
        });

        res.status(201).json({ message: "¡Restaurante creado con éxito!", restaurante: nuevoRestaurante });
    } catch (error) {
        console.error("Error al crear restaurante:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerTodos = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll();
        res.json(restaurantes); 
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const filtrarRestaurantes = async (req, res) => {
    try {
        const { pais, picoso, vegetariano, dulce } = req.query;

        console.log(`Buscando restaurantes para el país ISO: ${pais}`);
        
        const restaurantesRecomendados = await Restaurante.findAll();

        res.json(restaurantesRecomendados);
    } catch (error) {
        console.error('Error al filtrar:', error);
        res.status(500).json({ error: 'Error en el servidor al filtrar' });
    }
};

module.exports = {
    obtenerTodos,
    filtrarRestaurantes
};