const express = require('express');
const UsuariosController = require('../controllers/usuariosController.js');

const router = express.Router();

router.post('/', UsuariosController.crearUsuario);

module.exports = router;