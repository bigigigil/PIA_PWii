const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const verificarToken = require('../middleware/authMiddleware');


router.post('/registro', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);

router.get('/perfil', authMiddleware, usuarioController.obtenerPerfil);
router.put('/perfil', authMiddleware, usuarioController.actualizarPerfil);

router.post('/favoritos/:restauranteId', verificarToken, usuarioController.agregarFavorito);
router.delete('/favoritos/:restauranteId', verificarToken, usuarioController.eliminarFavorito);

router.post('/favoritos/platillos/:platilloId', verificarToken, usuarioController.agregarPlatilloFavorito);
router.delete('/favoritos/platillos/:platilloId', verificarToken, usuarioController.eliminarPlatilloFavorito);

router.post('/favoritos/paises/:paisId', verificarToken, usuarioController.agregarPaisFavorito);
router.delete('/favoritos/paises/:paisId', verificarToken, usuarioController.eliminarPaisFavorito);

router.post('/favoritos/paises/iso/:iso', verificarToken, usuarioController.agregarPaisFavoritoPorIso);

module.exports = router;