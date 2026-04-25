const { Categoria } = require('../models');

const obtenerTodas = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ error: 'El nombre no puede estar vacío' });
        }

        const [categoria, creada] = await Categoria.findOrCreate({
            where: { nombre: nombre.trim() }
        });

        if (creada) {
            res.status(201).json({ message: 'Categoría creada', categoria });
        } else {
            res.status(400).json({ error: 'Esta categoría ya existe' });
        }
    } catch (error) {
        console.error("Error al crear categoría:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = { obtenerTodas, crearCategoria };