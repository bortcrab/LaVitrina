const subastasDAO = require("../dataAccess/subastasDAO.js");
const usuariosDAO = require("../dataAccess/usuariosDAO.js");
const { AppError } = require("../utils/appError.js");

/**
 * Controlador para las operaciones relacionadas con subastas.
 *
 * Encapsula los handlers (métodos) que responden a las rutas HTTP relacionadas
 * con la creación y obtención de subastas. Cada método está pensado para ser
 * usado como middleware/handler de Express: recibe los objetos (req, res, next).
 *
 * Errores esperados: los errores durante el acceso a datos se envían al siguiente
 * middleware de error mediante `next(new AppError(...))`.
 */
class SubastasController {

    constructor() { }

    /**
     * Handler para crear una nueva subasta.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async crearSubasta(req, res, next) {
        try {
            const { titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario, fechaInicio, fechaFin } = req.body;

            if (!titulo || !descripcion || precio < 1) {
                return next(new AppError('Los campos título, descripción y precio son obligatorios.'), 400);
            } else if (!idCategoria) {
                return next(new AppError('Se debe elegir una categoría para la publicación.'), 400);
            } else if (!idUsuario) {
                return next(new AppError('Se debe iniciar sesión para crear publicaciones.'), 400);
            } else if (!fechaInicio || !fechaFin) {
                return next(new AppError('Se deben proporcionar las fechas de inicio y fin de la subasta.'), 400);
            } else if (new Date(fechaInicio) >= new Date(fechaFin)) {
                return next(new AppError('La fecha de fin debe ser posterior a la fecha de inicio.'), 400);
            }

            const nuevaSubasta = await subastasDAO.crearSubasta({
                titulo,
                descripcion,
                precio,
                idCategoria,
                idUsuario,
                imagenes,
                etiquetas,
                fechaInicio,
                fechaFin
            });

            res.status(200).json(nuevaSubasta);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la subasta.', 500));
        }
    }

    /**
     * Handler para obtener la lista de subastas. Dado un conjunto de filtros opcionales.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async obtenerSubastas(req, res, next) {
        try {
            // Obtenemos los filtros de los query params.
            const filtros = {
                titulo: req.query.titulo,
                categoria: req.query.categoria,
                etiquetas: req.query.etiquetas ? req.query.etiquetas.split(',') : undefined,
                fechaInicio: req.query.fechaInicio,
                fechaFin: req.query.fechaFin,
                offset: ((parseInt(req.query.pagina) || 1) - 1) * 20,
            };

            // Obtenemos las subastas.
            const subastas = await subastasDAO.obtenerSubastas(filtros);

            // Devolvemos las subastas obtenidas.
            res.status(200).json({
                subastas
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las subastas', 500));
        }
    }

    /**
     * Handler para obtener la lista de subastas de un usuario específico.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async obtenerSubastasPorUsuario(req, res, next) {
        try {
            // Obtenemos el ID del usuario de los parámetros de la solicitud.
            const idUsuario = req.params.idUsuario;
            // También obtenemos la página.
            const pagina = parseInt(req.query.pagina) || 1; // por defecto estamos en la página 1.
            const limite = 20; // Se mostraran 20 subastas por página.

            // Calculamos el offset según la página y el límite.
            const offset = (pagina - 1) * limite;

            // Obtenemos las subastas.
            const subastas = await subastasDAO.obtenerSubastasPorUsuario(idUsuario, offset);

            // Devolvemos las subastas obtenidas.
            res.status(200).json({
                subastas
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las subastas', 500));
        }
    }

    /**
     * Handler para obtener los datos de una subasta específica por su ID.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async obtenerSubastaPorId(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            if (!idSubasta) {
                return next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }

            // Obtenemos la subasta.
            const subasta = await subastasDAO.obtenerSubastaPorId(idSubasta);
            if (!subasta) {
                return next(new AppError('La subasta no existe.', 404));
            }

            // Devolvemos la subasta obtenida.
            res.status(200).json({
                subasta
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la subasta', 500));
        }
    }

    /**
     * Handler para actualizar los datos de una subasta específica por su ID.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async actualizarSubasta(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            const idUsuario = req.body.idUsuario;
            if (!idSubasta) {
                return next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }
            if (!(await subastasDAO.obtenerSubastaPorId(idSubasta))) {
                return next(new AppError('La subasta no existe.', 404));
            }

            if (!idUsuario) {
                return next(new AppError('Se debe iniciar sesión para actualizar la subasta.', 400));
            }
            if (!(await usuariosDAO.obtenerUsuarioPorId(idUsuario))) {
                return next(new AppError('El usuario no existe.', 404));
            }
            const subastaData = await subastasDAO.obtenerSubastaPorId(idSubasta);
            if (idUsuario !== subastaData.Publicacion.idUsuario) {
                return next(new AppError('No tienes permiso para actualizar esta subasta.', 403));
            }

            if (Object.keys(req.body).length === 0) {
                return next(new AppError('No se proporcionó ningún dato para actualizar la subasta.', 400));
            }

            // Obtenemos la subasta.
            const subasta = await subastasDAO.actualizarSubasta(idSubasta, req.body);

            // Devolvemos la subasta obtenida.
            res.status(200).json({
                subasta
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la subasta', 500));
        }
    }

    /**
     * Handler para eliminar una subasta específica por su ID.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async eliminarSubasta(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            const idUsuario = req.body.idUsuario;
            if (!idSubasta) {
                return next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }
            if (!(await subastasDAO.obtenerSubastaPorId(idSubasta))) {
                return next(new AppError('La subasta no existe.', 404));
            }

            if (!idUsuario) {
                return next(new AppError('Se debe iniciar sesión para actualizar la subasta.', 400));
            }
            if (!(await usuariosDAO.obtenerUsuarioPorId(idUsuario))) {
                return next(new AppError('El usuario no existe.', 404));
            }
            const subastaData = await subastasDAO.obtenerSubastaPorId(idSubasta);
            if (idUsuario !== subastaData.Publicacion.idUsuario) {
                return next(new AppError('No tienes permiso para eliminar esta subasta.', 403));
            }

            // Obtenemos la subasta.
            const subasta = await subastasDAO.eliminarSubasta(idSubasta);

            // Devolvemos la subasta obtenida.
            res.status(200).json({
                subasta
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la subasta', 500));
        }
    }
}

module.exports = new SubastasController();