const express = require('express');
const pujasController = require('../controllers/pujasController.js');

const router = express.Router();

router.post('/', pujasController.crearPuja);
router.get('/', pujasController.obtenerPujas);
router.get('/mas-alta', pujasController.obtenerPujaMasAlta);

module.exports = router;
