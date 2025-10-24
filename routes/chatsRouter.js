const express = require('express');
const ChatController = require('../controllers/chatsController.js');

const router = express.Router();

router.get('/:id', ChatController.obtenerChatPorId)
router.get('/', ChatController.obtenerChatsPorUsuario)
router.post('/', ChatController.crearChat)
router.delete('/:id', ChatController.eliminarChat)

module.exports = router;