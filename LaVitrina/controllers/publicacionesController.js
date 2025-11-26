const publicacionesDAO = require("../dataAccess/publicacionesDAO.js");
const reseniasDAO = require("../dataAccess/reseniasDAO.js");
const usuariosDAO = require('../dataAccess/usuariosDAO.js');
const { AppError } = require("../utils/appError.js");

/**
 * Controlador que maneja las operaciones relacionadas con publicaciones.
 *
 * Cada método está diseñado para ser usado como middleware/handler de Express
 * y utiliza los DAOs correspondientes para interactuar con la capa de datos.
 * Los errores se pasan al middleware de manejo de errores usando `next(new AppError(...))`.
 */
class PublicacionesController {

    constructor() { }

    /**
     * Crea una nueva publicación.
     *
     * Validaciones principales:
     * - `titulo`, `descripcion` y `precio` son obligatorios (precio debe ser >= 1).
     * - `idCategoria` e `idUsuario` deben estar presentes.
     *
     * @param {import('express').Request} req - Request de Express. Se esperan en `req.body`:
     *   {string} titulo, {string} descripcion, {number} precio, {string[]} etiquetas,
     *   {string[]} imagenes, {number} idCategoria, {number} idUsuario
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y la publicación creada en caso de éxito.
     */
    async crearPublicacion(req, res, next) {
        try {
            const { titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario } = req.body;

            //Se valida que se envíen los datos minimos necesarios para crear la publicacion
            if (!titulo || !descripcion || precio < 1) {
                next(new AppError('Los campos título, descripción y precio son obligatorios.'), 400);
            }

            //Se valida que se haya elegido una categoria a la publicacion
            if (!idCategoria) {
                next(new AppError('Se debe elegir una categoría para la publicación.'), 400);
            }

            //Se valida que el usuario tenga una sesión iniciada
            if (!idUsuario) {
                next(new AppError('Se debe iniciar sesión para crear publicaciones.'), 400);
            }

            const publicacion = await publicacionesDAO.crearPublicacion(titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario);
            res.status(200).json(publicacion);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la publicación.', 500));
        }
    }

    /**
     * Obtiene una lista paginada de publicaciones.
     *
     * Query params:
     * - `pagina` (opcional): número de página (por defecto 1). Cada página usa 20 items.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.query.pagina`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones.
     */
    async obtenerPublicaciones(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicaciones(offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

    /**
     * Obtiene una publicación específica por su ID.
     *
     * Params:
     * - `req.params.id`: ID de la publicación a obtener.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.params.id`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y los datos de la publicación.
     */
    async obtenerPublicacionPorId(req, res, next) {
        try {
            const id = req.params.id;

            const publicacion = await publicacionesDAO.obtenerPublicacionPorId(id);

            if (!publicacion) {
                next(new AppError('La publicación no existe.', 404));
            }

            const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

            publicacion.Usuario.puntuacion = puntuacionUsuario;

            const respuesta = formatearRespuestaJSON(publicacion);
            res.status(200).json(respuesta);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al obtener la publicación.', 500));
        }
    }

    /**
     * Obtiene publicaciones de un usuario específico (paginado).
     *
     * Params:
     * - `req.params.id`: ID del usuario.
     * Query params:
     * - `pagina` (opcional): número de página.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.params.id` y `req.query.pagina`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones del usuario.
     */
    async obtenerPublicacionesPorUsuario(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            //Se valida que se haya enviado el id del usuario
            const idUsuario = req.params.id;
            if (!idUsuario) {
                next('Se debe proporcionar un ID de usuario válido.', 400);
            }

            //Se valida que el id proporcionado sea el de un usuario existente
            const usuarioExists = await usuariosDAO.obtenerUsuarioPorId(idUsuario);
            if (!usuarioExists) {
                next('El usuario no existe', 400);
            }

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicacionesPorUsuario(idUsuario, offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(idUsuario);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    /**
     * Busca publicaciones por título (coincidencia parcial).
     *
     * Query params:
     * - `titulo` (requerido): texto para buscar en títulos.
     * - `pagina` (opcional): número de página.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.query.titulo`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones que coinciden.
     */
    async obtenerPublicacionesPorTitulo(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            //Se valida que se haya enviado el titulo por el que se buscará
            const titulo = req.query.titulo;
            if (!titulo) {
                next(new AppError('Se debe especificar el titulo por el que se desea buscar las publicaciones.', 400));
            }

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicacionesPorTitulo(titulo, offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    /**
     * Obtiene publicaciones filtradas por categoría (paginado).
     *
     * Params:
     * - `req.params.id`: ID de la categoría.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.params.id`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones en la categoría.
     */
    async obtenerPublicacionesPorCategoria(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            //Se valida que se haya enviado la categoria
            const idCategoria = req.params.id;
            if (!idCategoria) {
                next(new AppError('Se debe especificar la categoría para realizar la búsqueda.', 400));
            }

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicacionesPorCategoria(idCategoria, offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    /**
     * Obtiene publicaciones que contienen alguna de las etiquetas proporcionadas.
     *
     * Query params:
     * - `etiquetas` (requerido): lista separada por comas de etiquetas.
     * - `pagina` (opcional): número de página.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.query.etiquetas`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones que contienen las etiquetas.
     */
    async obtenerPublicacionesPorEtiquetas(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            //Se valida que se hayan enviado etiquetas
            let etiquetas = req.query.etiquetas;
            if (!etiquetas) {
                next(new AppError('Se deben especificar las etiquetas para la búsqueda.', 400));
            }

            etiquetas = etiquetas.split(',').map(etiqueta => etiqueta.trim());

            //Se valida que haya al menos una etiqueta
            if (etiquetas.length < 1) {
                next(new AppError('Se debe incluir al menos una etiqueta para la búsqueda.', 400));
            }

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicacionesPorEtiquetas(etiquetas, offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

    /**
     * Obtiene publicaciones dentro de un periodo de fechas (paginado).
     *
     * Query params:
     * - `inicio` (requerido): fecha de inicio en formato aceptado por `new Date()`.
     * - `fin` (requerido): fecha de fin en formato aceptado por `new Date()`.
     * - `pagina` (opcional): número de página.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.query.inicio` y `req.query.fin`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y el array de publicaciones dentro del periodo.
     */
    async obtenerPublicacionesPorPeriodo(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            const fechaInicio = new Date(req.query.inicio);
            const fechaFin = new Date(req.query.fin);

            //Se valida que se hayan enviado las fechass correctamente
            if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                next(new AppError('Los campos fechaInicio y fechaFin son requeridos.', 400));
            }

            //Se valida que las fechas formen un periodo válido
            if (fechaInicio > fechaFin) {
                next(new AppError('Las fechas deben crear un periodo válido.', 400));
            }

            const publicacionesObtenidas = await publicacionesDAO.obtenerPublicacionesPorPeriodo(fechaInicio, fechaFin, offset);

            const publicaciones = [];
            for (const publicacion of Array.from(publicacionesObtenidas)) {
                const puntuacionUsuario = await reseniasDAO.calcularPuntuacionUsuario(publicacion.Usuario.id);

                publicacion.Usuario.puntuacion = puntuacionUsuario;

                publicaciones.push(formatearRespuestaJSON(publicacion));
            }

            res.status(200).json(publicaciones);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

    /**
     * Actualiza una publicación existente.
     *
     * Params:
     * - `req.params.id`: ID de la publicación a actualizar.
     * Body opcionalmente contiene campos a actualizar: titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.params.id` y `req.body`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y la publicación actualizada.
     */
    async actualizarPublicacion(req, res, next) {
        try {
            const idPublicacion = req.params.id;
            if (!idPublicacion) {
                next(new AppError('Se debe especificar la publicación a actualizar.', 400));
            }

            const publicacionExists = await publicacionesDAO.obtenerPublicacionPorId(idPublicacion);
            if (!publicacionExists) {
                next(new AppError('La publicación que se desea actualizar no existe', 400));
            }

            const { titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes } = req.body;
            if (!titulo && !descripcion && !precio && !estado && !idCategoria && !etiquetas && !imagenes) {
                next(new AppError('No se proporcionó ningún dato para actualizar la publicación.', 400));
            }

            const publicacionActualizada = await publicacionesDAO.actualizarPublicacion(idPublicacion, titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes);
            res.status(200).json(publicacionActualizada);
        } catch (error) {
            next(new AppError('Ocurrió un error al actualizar la publicación.', 500));
        }
    }

    /**
     * Elimina una publicación por su ID.
     *
     * Params:
     * - `req.params.id`: ID de la publicación a eliminar.
     *
     * @param {import('express').Request} req - Request de Express. Usa `req.params.id`.
     * @param {import('express').Response} res - Response de Express.
     * @param {import('express').NextFunction} next - Next function para manejo de errores.
     * @returns {Promise<void>} Responde con status 200 y un mensaje de confirmación.
     */
    async eliminarPublicacion(req, res, next) {
        try {
            const idPublicacion = req.params.id;
            if (!idPublicacion) {
                next(new AppError('Se debe especificar la publicación a eliminar.', 400));
            }

            const publicacionExists = await publicacionesDAO.obtenerPublicacionPorId(idPublicacion);
            if (!publicacionExists) {
                next(new AppError('La publicación que se desea eliminar no existe.', 400));
            }

            await publicacionesDAO.eliminarPublicacion(idPublicacion);
            res.status(200).json('Se eliminó la publicación exitosamente.');
        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar la publicacion', 500));
        }
    }

}

function formatearRespuestaJSON(publicacionData) {
    const respuestaJSON = {
        id: publicacionData.id,
        titulo: publicacionData.titulo,
        descripcion: publicacionData.descripcion,
        fechaPublicacion: (publicacionData.fechaPublicacion.getDate()) + '-' + (publicacionData.fechaPublicacion.getMonth() + 1) + '-' + publicacionData.fechaPublicacion.getFullYear(),
        precio: publicacionData.precio,
        estado: publicacionData.estado,
        tipo: publicacionData.Subastum ? 'Subasta' : "Venta",
        categoria: {
            nombre: publicacionData.Categorium.nombre
        },
        usuario: {
            id: publicacionData.Usuario.id,
            nombres: publicacionData.Usuario.nombres,
            apellidoPaterno: publicacionData.Usuario.apellidoPaterno,
            apellidoMaterno: publicacionData.Usuario.apellidoMaterno,
            fotoPerfil: publicacionData.Usuario.fotoPerfil,
            puntuacion: (publicacionData.Usuario.puntuacion) ? publicacionData.Usuario.puntuacion : '0.0'
        },
        imagenes: publicacionData.ImagenesPublicacions.map(imagen => imagen.url),
        etiquetas: publicacionData.EtiquetasPublicacions.map(etiqueta => etiqueta.etiqueta)
    }

    return respuestaJSON;
}

module.exports = new PublicacionesController();