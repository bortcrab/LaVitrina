const express = require('express');
const ChatController = require('../controllers/chatsController.js');

const router = express.Router();

router.get('/:id', ChatController.obtenerChatPorId)
router.get('/', ChatController.obtenerChatsPorUsuario)
router.post('/', ChatController.crearChat)
router.post('/:id/', ChatController.agregarUsuarioAChat)
router.delete('/:id', ChatController.eliminarChat)
router.delete('/:id/:id', ChatController.eliminarUsuarioDeChat)

module.exports = router;