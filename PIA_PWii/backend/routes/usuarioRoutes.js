const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registro', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);

router.get('/perfil', authMiddleware, usuarioController.obtenerPerfil);
router.put('/perfil', authMiddleware, usuarioController.actualizarPerfil);

module.exports = router;