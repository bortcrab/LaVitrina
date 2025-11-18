const pujasDAO = require("../dataAccess/pujasDAO.js");
const subastasDAO = require("../dataAccess/subastasDAO.js");
const usuariosDAO = require("../dataAccess/usuariosDAO.js");
const { AppError } = require("../utils/appError.js");

/**
 * Controlador para las operaciones relacionadas con pujas.
 *
 * Encapsula los handlers (métodos) que responden a las rutas HTTP relacionadas
 * con la creación y obtención de pujas. Cada método está pensado para ser
 * usado como middleware/handler de Express: recibe los objetos (req, res, next).
 *
 * Errores esperados: los errores durante el acceso a datos se envían al siguiente
 * middleware de error mediante `next(new AppError(...))`.
 */
class PujasController {

    constructor() { }

    /**
     * Handler para crear una nueva puja.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async crearPuja(req, res, next) {
        try {
            const idSubasta = req.body.idSubasta;
            const { monto, idUsuario } = req.body;

            if (idUsuario === undefined) {
                return next(new AppError('El ID de usuario es obligatorio.', 400));
            }

            if (await usuariosDAO.obtenerUsuarioPorId(idUsuario) === null) {
                return next(new AppError('El usuario no existe.', 404));
            }

            if (idSubasta === undefined) {
                return next(new AppError('El ID de subasta es obligatorio.', 400));
            }

            if (await subastasDAO.obtenerSubastaPorId(idSubasta) === null) {
                return next(new AppError('La subasta no existe.', 404));
            }

            // Obtenemos la puja más alta actual.
            const pujaMasAlta = await pujasDAO.obtenerPujaMasAlta(idSubasta);
            
            if (idUsuario === pujaMasAlta?.idUsuario) {
                return next(new AppError('No puedes sobrepujar tu propia puja más alta.', 400));
            }

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

    /**
     * Handler para obtener la lista de pujas de una subasta. Si se provee un usuario,
     * se filtran las pujas por ese usuario.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async obtenerPujas(req, res, next) {
        try {
            const { idSubasta, idUsuario } = req.query;

            if (!idSubasta) {
                return next(new AppError('El ID de subasta es obligatorio.', 400));
            }

            if (await subastasDAO.obtenerSubastaPorId(idSubasta) === null) {
                return next(new AppError('La subasta no existe.', 404));
            }

            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 50;
            const offset = (pagina - 1) * limite;

            let pujas;
            if (idUsuario && idSubasta) {
                if (await usuariosDAO.obtenerUsuarioPorId(idUsuario) === null) {
                    return next(new AppError('El usuario no existe.', 404));
                }
                pujas = await pujasDAO.obtenerPujasPorUsuario(idSubasta, idUsuario, offset);
            } else {
                pujas = await pujasDAO.obtenerPujas(idSubasta, offset);
            }

            res.status(200).json(pujas);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las pujas.', 500));
        }
    }

    /**
     * Handler para obtener la puja más alta de una subasta.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async obtenerPujaMasAlta(req, res, next) {
        try {
            const idSubasta = req.query.idSubasta;

            if (!idSubasta) {
                return next(new AppError('El ID de subasta es obligatorio.', 400));
            }

            if (await subastasDAO.obtenerSubastaPorId(idSubasta) === null) {
                return next(new AppError('La subasta no existe.', 404));
            }

            const pujaMasAlta = await pujasDAO.obtenerPujaMasAlta(idSubasta);
            res.status(200).json(pujaMasAlta);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la puja más alta.', 500));
        }
    }

}

module.exports = new PujasController();