const express = require('express');
const categoriasController = require('../controllers/categoriasController.js');

const router = express.Router();

router.post('/', categoriasController.crearCategoria);
router.get('/', categoriasController.obtenerCategorias);

module.exports = router;