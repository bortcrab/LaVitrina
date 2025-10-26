const express = require('express');
const UsuariosController = require('../controllers/usuariosController.js');
const validateJWT = require('../utils/validateJWT.js');
const router = express.Router();

router.post('/', UsuariosController.crearUsuario);
router.post('/iniciar-sesion', UsuariosController.iniciarSesion);

router.use(validateJWT);

router.get('/', UsuariosController.obtenerUsuarios);
router.get('/correo', UsuariosController.obtenerUsuarioPorCorreo);
router.get('/:id', UsuariosController.obtenerUsuarioPorId);
router.put('/cambiar-contrasenia', UsuariosController.cambiarContrasenia);
router.put('/:id', UsuariosController.actualizarUsuario);
router.delete('/:id', UsuariosController.eliminarUsuario);

module.exports = router;