const express = require('express');
const publicacionesController = require('../controllers/publicacionesController.js');

const router = express.Router();

router.post('/', publicacionesController.crearPublicacion);
router.get('/', publicacionesController.obtenerPublicaciones);
router.get('/buscar', publicacionesController.obtenerPublicacionesPorTitulo);
router.get('/etiquetas', publicacionesController.obtenerPublicacionesPorEtiquetas);
router.get('/periodo', publicacionesController.obtenerPublicacionesPorPeriodo);
router.get('/usuario/:id', publicacionesController.obtenerPublicacionesPorUsuario);
router.get('/categoria/:id', publicacionesController.obtenerPublicacionesPorCategoria);
router.get('/:id', publicacionesController.obtenerPublicacionPorId);
router.put('/:id', publicacionesController.actualizarPublicacion);
router.patch('/:id/estado', publicacionesController.cambiarEstado);
router.delete('/:id', publicacionesController.eliminarPublicacion);

module.exports = router;
