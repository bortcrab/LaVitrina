const express = require('express');
const publicacionesController = require('../controllers/publicacionesController.js');

const router = express.Router();

router.post('/', publicacionesController.crearPublicacion);

module.exports = router;
