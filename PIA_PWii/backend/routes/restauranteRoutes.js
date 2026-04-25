const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');

router.get('/', restauranteController.obtenerTodos);

router.get('/filtrar', restauranteController.filtrarRestaurantes);

router.post('/', restauranteController.crearRestaurante);

router.post('/:id/menu', restauranteController.agregarPlatillo);

module.exports = router;