const express = require('express');
const ReseniasController = require('../controllers/reseniasController.js');

const router = express.Router();

router.post('/', ReseniasController.crearResenia);
router.get('/', ReseniasController.obtenerResenias);
router.get('/:id', ReseniasController.obtenerReseniaPorId);
router.get('/usuarioReseniado/:idUsuarioReseniado', ReseniasController.obtenerReseniasPorUsuarioReseniado);
router.get('/resenias-altas/:idUsuarioReseniado', ReseniasController.obtenerReseniasMasAltas);
router.get('/resenias-bajas/:idUsuarioReseniado', ReseniasController.obtenerReseniasMasBajas);
router.put('/:id', ReseniasController.actualizarResenia);
router.delete('/:id', ReseniasController.eliminarResenia);

module.exports = router;