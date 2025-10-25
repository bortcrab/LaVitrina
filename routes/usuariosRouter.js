const express = require('express');
const UsuariosController = require('../controllers/usuariosController.js');

const router = express.Router();

router.post('/', UsuariosController.crearUsuario);
router.get('/', UsuariosController.obtenerUsuarios);
router.get('/correo', UsuariosController.obtenerUsuarioPorCorreo);
router.get('/:id', UsuariosController.obtenerUsuarioPorId);
router.put('/cambiar-contrasenia', UsuariosController.cambiarContrasenia);
router.put('/:id', UsuariosController.actualizarUsuario);
router.delete('/:id', UsuariosController.eliminarUsuario);
router.post('/iniciar-sesion', UsuariosController.iniciarSesion);

module.exports = router;