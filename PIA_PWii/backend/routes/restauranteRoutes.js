const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');

router.get('/', restauranteController.obtenerTodos);

router.get('/filtrar', restauranteController.filtrarRestaurantes);

module.exports = router;