const pujasDAO = require("../dataAccess/pujasDAO.js");
const usuariosDAO = require("../dataAccess/usuariosDAO.js");
const { AppError } = require("../utils/appError.js");

class PujasController {

    constructor() { }

    async crearPuja(req, res, next) {
        try {
            const idSubasta = req.params.idSubasta;
            const { monto, idUsuario } = req.body;

            // Obtenemos la puja más alta actual.
            const pujaMasAlta = await pujasDAO.obtenerPujaMasAlta(idSubasta);
            // Obtenemos el monto de la puja más alta (0 si no hay pujas).
            const montoPujaMasAlta = pujaMasAlta?.monto || 0;

            // Validar que el monto sea mayor
            if (monto <= montoPujaMasAlta) {
                return next(new AppError('El monto de la puja debe ser mayor que la puja más alta actual.', 400));
            }

            // Creamos la nueva puja.
            const nuevaPuja = await pujasDAO.crearPuja({
                monto,
                idUsuario,
                idSubasta,
                fechaPuja: new Date()
            });

            res.status(200).json(nuevaPuja);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la puja.', 500));
        }
    }

    async obtenerPujas(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 50;
            const offset = (pagina - 1) * limite;

            const pujas = await pujasDAO.obtenerPujas(req.params.idSubasta, offset);
            res.status(200).json(pujas);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las pujas.', 500));
        }
    }

    async obtenerPujasPorUsuario(req, res, next) {
        try {
            const idUsuario = req.params.idUsuario;

            if (!idUsuario) {
                return next(new AppError('El ID de usuario es obligatorio.', 400));
            }

            if (await usuariosDAO.obtenerUsuarioPorId(idUsuario) === null) {
                return next(new AppError('El usuario no existe.', 404));
            }

            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 50;
            const offset = (pagina - 1) * limite;

            const pujas = await pujasDAO.obtenerPujasPorUsuario(req.params.idUsuario, offset);
            res.status(200).json(pujas);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las pujas del usuario.', 500));
        }
    }

    async obtenerPujaMasAlta(req, res, next) {
        try {
            const idSubasta = req.params.idSubasta;
            const pujaMasAlta = await pujasDAO.obtenerPujaMasAlta(idSubasta);
            res.status(200).json(pujaMasAlta);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la puja más alta.', 500));
        }
    }

}

module.exports = new PujasController();