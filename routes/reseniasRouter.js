const express = require('express');
const ReseniasController = require('../controllers/reseniasController.js');

const router = express.Router();

router.post('/', ReseniasController.crearResenia);

module.exports = router;