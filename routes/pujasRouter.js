const express = require('express');
const pujasController = require('../controllers/pujasController.js');

const router = express.Router();

router.post('/:idSubasta', pujasController.crearPuja);
router.get('/:idSubasta', pujasController.obtenerPujas);
router.get('/:idSubasta/:idUsuario', pujasController.obtenerPujasPorUsuario);
router.get('/:idSubasta/mas-alta', pujasController.obtenerPujaMasAlta);

module.exports = router;
