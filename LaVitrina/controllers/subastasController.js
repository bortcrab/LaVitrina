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
            const {
                titulo,
                descripcion,
                precio,
                etiquetas,
                /*imagenes,*/
                idCategoria,
                idUsuario,
                inicioSubasta,
                finSubasta
            } = req.body;
            const errores = [];

            // Validar título
            if (!titulo || titulo.trim() === '') {
                errores.push("El título es obligatorio.");
            } else if (titulo.length < 5) {
                errores.push("El título debe tener al menos 5 caracteres.");
            } else if (titulo.length > 100) {
                errores.push("El título no puede exceder 100 caracteres.");
            }

            // Validar descripción
            if (!descripcion || descripcion.trim() === '') {
                errores.push("La descripción es obligatoria.");
            } else if (descripcion.length < 10) {
                errores.push("La descripción debe tener al menos 10 caracteres.");
            } else if (descripcion.length > 1000) {
                errores.push("La descripción no puede exceder 1000 caracteres.");
            }

            // Validar precio
            if (!precio || precio <= 0) {
                errores.push("El precio debe ser mayor a 0.");
            } else if (precio > 1000000) {
                errores.push("El precio no puede exceder $1,000,000.");
            }
            /*
                        // Validar imágenes
                        if (!imagenes || imagenes.length === 0) {
                            errores.push("Debes agregar al menos una imagen.");
                        } else if (imagenes.length > 10) {
                            errores.push("No puedes agregar más de 10 imágenes.");
                        } else {
                            // Validar tamaño de cada imagen (máx 5MB por imagen)
                            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
                            const imagenesGrandes = imagenes.filter(img => img.size > MAX_SIZE);
                            if (imagenesGrandes.length > 0) {
                                errores.push(`Algunas imágenes exceden el tamaño máximo de 5MB.`);
                            }
            
                            // Validar tipo de archivo
                            const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
                            const imagenesInvalidas = imagenes.filter(img => !tiposPermitidos.includes(img.type));
                            if (imagenesInvalidas.length > 0) {
                                errores.push("Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF.");
                            }
                        }
            */          // BORRAR ESTO ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            const imagenes = ["https://picsum.photos/200", "https://picsum.photos/200"];

            // Validar etiquetas
            if (etiquetas && etiquetas.length > 10) {
                errores.push("No puedes agregar más de 10 etiquetas.");
            }

            // Validar fechas de subasta
            if (!inicioSubasta) {
                errores.push("La fecha de inicio de subasta es obligatoria.");
            }
            if (!finSubasta) {
                errores.push("La fecha de fin de subasta es obligatoria.");
            }

            if (inicioSubasta && finSubasta) {
                const fechaInicio = new Date(inicioSubasta);
                const fechaFin = new Date(finSubasta);
                const ahora = new Date();

                if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                    errores.push("Las fechas de subasta no son válidas.");
                } else {
                    if (fechaInicio < ahora) {
                        errores.push("La fecha de inicio debe ser futura.");
                    }
                    if (fechaFin <= fechaInicio) {
                        errores.push("La fecha de fin debe ser posterior a la fecha de inicio.");
                    }
                }
            }


            // Si hay errores, rechazar
            if (errores.length > 0) {
                console.error('SubastaController: Errores de validación:', errores);
                return next(new AppError(errores, 400));
            }

            const subastaData = {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes,
                idCategoria,
                idUsuario,
                fechaInicio: inicioSubasta,
                fechaFin: finSubasta
            }

            const subasta = await subastasDAO.crearSubasta(subastaData);
            res.status(200).json(subasta);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la publicación.', 500));
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