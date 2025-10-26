const express = require('express');
const subastasController = require('../controllers/subastasController.js');

const router = express.Router();

router.post('/', subastasController.crearSubasta);
router.get('/', subastasController.obtenerSubastas);
router.get('/usuario/:idUsuario', subastasController.obtenerSubastasPorUsuario);
router.get('/:idSubasta', subastasController.obtenerSubastaPorId);
router.put('/:idSubasta', subastasController.actualizarSubasta);
router.delete('/:idSubasta', subastasController.eliminarSubasta);

module.exports = router;
