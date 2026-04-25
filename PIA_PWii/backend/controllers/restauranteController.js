const { Op } = require('sequelize');
const { Restaurante, Platillo, MenuRestaurante, Pais, Categoria, Resena, Usuario } = require('../models');
const obtenerTodos = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            include: [{
                model: Platillo,
                as: 'menu',
                attributes: ['id', 'nombre', 'descripcion'],
                through: { attributes: ['precio'] },
                include: [
                    { model: Pais, as: 'pais', attributes: ['codigo_iso'] },
                    { model: Categoria, as: 'categorias', attributes: ['id', 'nombre'] }
                ]
            }, {
                model: Resena,
                as: 'resenas',
                attributes: ['calificacion_estrellas', 'comentario'],
                include: [{ model: Usuario, as: 'autor', attributes: ['nombre'] }]
            }
            ]
        });
        res.json(restaurantes);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const filtrarRestaurantes = async (req, res) => {
    try {
        const { pais, q, categorias } = req.query;

        let condicionesRestaurante = {};
        if (q) {
            condicionesRestaurante = {
                nombre: { [Op.like]: `%${q}%` }
            };
        }

        let condicionesPlatillo = {};
        if (pais) {
            const paisEncontrado = await Pais.findOne({ where: { codigo_iso: pais } });
            if (paisEncontrado) condicionesPlatillo.pais_origen_id = paisEncontrado.id;
        }

        let includeCategorias = {
            model: Categoria,
            as: 'categorias',
            attributes: ['id', 'nombre']
        };

        if (categorias) {
            const arrayCategoriasIds = categorias.split(',').map(id => parseInt(id, 10));
            includeCategorias.where = {
                id: {
                    [Op.in]: arrayCategoriasIds
                }
            };
            includeCategorias.required = true;
        }

        const restaurantes = await Restaurante.findAll({
            where: condicionesRestaurante,
            include: [{
                model: Platillo,
                as: 'menu',
                where: Object.keys(condicionesPlatillo).length > 0 ? condicionesPlatillo : undefined,
                required: Object.keys(condicionesPlatillo).length > 0 || categorias !== undefined,
                attributes: ['id', 'nombre', 'descripcion'],
                through: { attributes: ['precio'] },
                include: [
                    {
                        model: Pais,
                        as: 'pais',
                        attributes: ['codigo_iso']
                    },
                    includeCategorias
                ]
            }]
        });
        res.json(restaurantes);
    } catch (error) {
        console.error('Error al filtrar:', error);
        res.status(500).json({ error: 'Error en el servidor al filtrar' });
    }
};

const crearRestaurante = async (req, res) => {
    try {
        const { nombre, latitud, longitud, sede_id } = req.body;
        if (!nombre || !latitud || !longitud || !sede_id) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }
        const nuevo = await Restaurante.create({ nombre, latitud, longitud, sede_id });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error('Error al crear restaurante:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const agregarPlatillo = async (req, res) => {
    try {
        const restauranteId = req.params.id;
        const { nombre, descripcion, precio, codigo_iso } = req.body;

        let pais_origen_id = null;
        if (codigo_iso) {
            const paisEncontrado = await Pais.findOne({ where: { codigo_iso: codigo_iso } });
            if (paisEncontrado) pais_origen_id = paisEncontrado.id;
        }

        const nuevoPlatillo = await Platillo.create({
            nombre,
            descripcion,
            pais_origen_id
        });

        await MenuRestaurante.create({
            restaurante_id: restauranteId,
            platillo_id: nuevoPlatillo.id,
            precio: precio ? parseFloat(precio) : 0
        });

        const { categoria_id } = req.body;
        if (categoria_id) {
            await nuevoPlatillo.addCategorias([categoria_id]);
        }

        res.status(201).json({ message: "¡Añadido con éxito!" });
    } catch (error) {
        console.error('Error al agregar platillo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const agregarResena = async (req, res) => {
    try {
        const restaurante_id = req.params.id;
        const usuario_id = req.usuario.id; 
        const { calificacion_estrellas, comentario } = req.body;

        const nuevaResena = await Resena.create({
            usuario_id,
            restaurante_id,
            calificacion_estrellas,
            comentario
        });

        res.status(201).json({ message: "¡Reseña guardada con éxito!" });
    } catch (error) {
        console.error('Error al guardar reseña:', error);
        res.status(500).json({ error: 'Error al guardar la reseña' });
    }
};

module.exports = {
    obtenerTodos,
    filtrarRestaurantes,
    crearRestaurante,
    agregarPlatillo,
    agregarResena
};