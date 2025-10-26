const subastasDAO = require("../dataAccess/subastasDAO.js");
const { AppError } = require("../utils/appError.js");

class SubastasController {

    constructor() { }

    async crearSubasta(req, res, next) {
        try {
            const { titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario, fechaInicio, fechaFin } = req.body;

            if (!titulo || !descripcion || precio < 1) {
                next(new AppError('Los campos título, descripción y precio son obligatorios.'), 400);
            } else if (!idCategoria) {
                next(new AppError('Se debe elegir una categoría para la publicación.'), 400);
            } else if (!idUsuario) {
                next(new AppError('Se debe iniciar sesión para crear publicaciones.'), 400);
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

    async obtenerSubastas(req, res, next) {
        try {
            // Obtenemos la página de los query params.
            const pagina = parseInt(req.query.pagina) || 1; // por defecto estamos en la página 1.
            const limite = 20; // Se mostraran 20 subastas por página.

            // Calculamos el offset según la página y el límite.
            const offset = (pagina - 1) * limite;

            // Obtenemos las subastas.
            const subastas = await subastasDAO.obtenerSubastas(offset);

            // Devolvemos las subastas obtenidas.
            res.status(200).json({
                subastas
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las subastas', 500));
        }
    }

    async obtenerSubastasConFiltros(req, res, next) {
        try {
            // Obtenemos los filtros de los query params.
            const filtros = {
                titulo: req.query.titulo,
                categoria: req.query.categoria,
                etiquetas: req.query.etiquetas ? req.query.etiquetas.split(',') : undefined,
                fechaInicio: req.query.fechaInicio,
                fechaFin: req.query.fechaFin,
                offset: ((parseInt(req.query.pagina) || 1) - 1) * 20,
                limite: 20 // Se mostraran 20 subastas por página.
            };

            // Obtenemos las subastas.
            const subastas = await subastasDAO.obtenerSubastasConFiltros(filtros);

            // Devolvemos las subastas obtenidas.
            res.status(200).json({
                subastas
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las subastas', 500));
        }
    }

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

    async obtenerSubastaPorId(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            if (!idSubasta) {
                next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }

            // Obtenemos la subasta.
            const subasta = await subastasDAO.obtenerSubastaPorId(idSubasta);
            if (!subasta) {
                next(new AppError('La subasta no existe.', 404));
            }

            // Devolvemos la subasta obtenida.
            res.status(200).json({
                subasta
            });
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la subasta', 500));
        }
    }

    async actualizarSubasta(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            if (!idSubasta) {
                next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }

            if (!(await subastasDAO.obtenerSubastaPorId(idSubasta))) {
                next(new AppError('La subasta no existe.', 404));
            }

            if (Object.keys(req.body).length === 0) {
                next(new AppError('No se proporcionó ningún dato para actualizar la subasta.', 400));
                return;
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

    async eliminarSubasta(req, res, next) {
        try {
            // Obtenemos el ID de la subasta de los parámetros de la solicitud.
            const idSubasta = req.params.idSubasta;
            if (!idSubasta) {
                next(new AppError('Se debe proporcionar un ID de subasta válido.', 400));
            }

            if (!(await subastasDAO.obtenerSubastaPorId(idSubasta))) {
                next(new AppError('La subasta no existe.', 404));
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