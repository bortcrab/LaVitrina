const express = require('express');
const reseniasController = require('../controllers/reseniasController.js');

const router = express.Router();

router.post('/:id', reseniasController.crearResenia);
router.get('/', reseniasController.obtenerResenias);
router.get('/:id', reseniasController.obtenerReseniaPorId);
router.get('/usuarioReseniado/:idUsuarioReseniado', reseniasController.obtenerReseniasPorUsuarioReseniado);
router.get('/resenias-altas/:idUsuarioReseniado', reseniasController.obtenerReseniasMasAltas);
router.get('/resenias-bajas/:idUsuarioReseniado', reseniasController.obtenerReseniasMasBajas);
router.put('/:id', reseniasController.actualizarResenia);
router.delete('/:id', reseniasController.eliminarResenia);

module.exports = router;