const express = require('express');
const publicacionesController = require('../controllers/publicacionesController.js');

const router = express.Router();

router.post('/', publicacionesController.crearPublicacion);
router.get('/', publicacionesController.obtenerPublicaciones);
router.get('/usuario/:id', publicacionesController.obtenerPublicacionesPorUsuario);
router.get('/buscar', publicacionesController.obtenerPublicacionesPorTitulo);
router.get('/categoria/:nombre', publicacionesController.obtenerPublicacionesPorCategoria);
router.get('/etiquetas', publicacionesController.obtenerPublicacionesPorEtiquetas);
router.get('/periodo', publicacionesController.obtenerPublicacionesPorPeriodo);
router.put('/:id', publicacionesController.actualizarPublicacion);
router.delete('/:id', publicacionesController.eliminarPublicacion);

module.exports = router;
