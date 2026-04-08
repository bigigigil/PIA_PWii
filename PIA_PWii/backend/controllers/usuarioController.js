const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { Usuario } = require('../models');
const Usuario = require('../models/Usuario'); 
const logger = require('../utils/logger'); 

exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, pais_id } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password_hash,
            pais_id: pais_id || null 
        });

        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente', 
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email } 
        });

    } catch (error) {
        logger.error(`Error en registro de usuario: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        }

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email }, 
            process.env.JWT_SECRET || 'muejeje', 
            { expiresIn: '2h' } 
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: token
        });

    } catch (error) {
        logger.error(`Error en login de usuario: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
      
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: ['id', 'nombre', 'email', 'pais_id'] 
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);

    } catch (error) {
        logger.error(`Error al obtener perfil: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor al obtener perfil' });
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const { nombre, email, pais_id, password } = req.body;
        
        const usuario = await Usuario.findByPk(req.usuario.id);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (nombre) usuario.nombre = nombre;
        if (email) usuario.email = email;
        if (pais_id) usuario.pais_id = pais_id;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            usuario.password_hash = await bcrypt.hash(password, salt);
        }

        await usuario.save();

        res.status(200).json({ mensaje: 'Perfil actualizado con éxito' });

    } catch (error) {
        logger.error(`Error al actualizar perfil: ${error.message}`);
        res.status(500).json({ error: 'Error interno al actualizar perfil' });
    }
};