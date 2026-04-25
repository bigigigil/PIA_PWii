const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');
const verificarToken = require('../middleware/authMiddleware');

router.get('/', restauranteController.obtenerTodos);

router.get('/filtrar', restauranteController.filtrarRestaurantes);

router.post('/', restauranteController.crearRestaurante);

router.post('/:id/menu', restauranteController.agregarPlatillo);
    
router.post('/:id/resenas', verificarToken, restauranteController.agregarResena);

module.exports = router;