const express = require('express');
const ChatController = require('../controllers/chatsController.js');

const router = express.Router();

router.get('/:idChat', ChatController.obtenerChatPorId)
router.get('/', ChatController.obtenerChatsPorUsuario)
router.post('/', ChatController.crearChat)
router.post('/:idChat/usuarios', ChatController.agregarUsuarioAChat)
router.delete('/:idChat', ChatController.eliminarChat)
router.delete('/:idChat/usuarios/:idUsuario', ChatController.eliminarUsuarioDeChat)

module.exports = router;