const express = require('express');
const ChatController = require('../controllers/chatsController.js');
const mensajesRouter = require('./mensajesRouter.js');

const router = express.Router();

router.get('/:idChat', ChatController.obtenerChatPorId)
router.get('/', ChatController.obtenerChatsPorUsuario)
router.post('/', ChatController.crearChat)
router.delete('/:idChat', ChatController.eliminarChat)
router.delete('/:idChat/usuarios/:idUsuario', ChatController.eliminarUsuarioDeChat)

router.use('/:idChat/mensajes', mensajesRouter);

module.exports = router;