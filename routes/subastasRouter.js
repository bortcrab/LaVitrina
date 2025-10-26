const express = require('express');
const subastasController = require('../controllers/subastasController.js');

const router = express.Router();

router.post('/', subastasController.crearSubasta);

module.exports = router;
