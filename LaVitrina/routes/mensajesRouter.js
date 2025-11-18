const express = require('express');
const MensajesController = require('../controllers/mensajesController.js');

const router = express.Router({ mergeParams: true });

router.get('/:idMensaje', MensajesController.obtenerMensajePorId)
router.get('/', MensajesController.obtenerMensajesDeChat)
router.post('/', MensajesController.crearMensaje)
router.delete('/:idMensaje', MensajesController.eliminarMensaje)

module.exports = router;