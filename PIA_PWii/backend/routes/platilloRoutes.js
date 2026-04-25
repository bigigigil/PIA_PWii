const express = require('express');
const router = express.Router();
const platilloController = require('../controllers/platilloController');

router.get('/', platilloController.obtenerTodos);

module.exports = router;