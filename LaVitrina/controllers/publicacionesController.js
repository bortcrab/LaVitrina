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
            const {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes,
                idCategoria,
                idUsuario,
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
            
            // Validar imágenes
            if (!imagenes || imagenes.length === 0) {
                errores.push("Debes agregar al menos una imagen.");
            } else if (imagenes.length > 10) {
                errores.push("No puedes agregar más de 10 imágenes.");
            }

            // Validar etiquetas
            if (etiquetas && etiquetas.length > 10) {
                errores.push("No puedes agregar más de 10 etiquetas.");
            }

            // Validar la categoría
            if (!idCategoria) {
                errores.push("La categoría es obligatoria.");
            }

            if (!idUsuario) {
                errores.push("El usuario es obligatorio.");
            }

            // Si hay errores, rechazar
            if (errores.length > 0) {
                console.error('PublicacionController: Errores de validación:', errores);
                return next(new AppError(errores, 400));
            }

            const publicacionData = {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes,
                idCategoria,
                idUsuario,
            }

            const publicacion = await publicacionesDAO.crearPublicacion(publicacionData);
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

        // Obtenemos el ID de la publicación de los parámetros de la solicitud.
        try {
            const idPublicacion = req.params.id;
            const {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes,
                idCategoria,
                idUsuario,
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

            // Validar imágenes
            if (!imagenes || imagenes.length === 0) {
                errores.push("Debes agregar al menos una imagen.");
            } else if (imagenes.length > 10) {
                errores.push("No puedes agregar más de 10 imágenes.");
            }

            // Validar etiquetas
            if (etiquetas && etiquetas.length > 10) {
                errores.push("No puedes agregar más de 10 etiquetas.");
            }

            // Si hay errores, rechazar
            if (errores.length > 0) {
                console.error('PublicacionController: Errores de validación:', errores);
                return next(new AppError(errores, 400));
            }

            const publicacionData = {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes,
                idCategoria,
                idUsuario,
            }

            // Actualizamos la publicación.
            const publicacion = await publicacionesDAO.actualizarPublicacion(idPublicacion, publicacionData);

            // Devolvemos la publicacion obtenida.
            res.status(200).json({
                publicacion
            });
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al actualizar la publicación', 500));
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

    async cambiarEstado(req, res, next) {
        try {
            const idPublicacion = req.params.id;
            const { estado } = req.body;

            if (!estado || !['Disponible', 'Vendido'].includes(estado)) {
                return next(new AppError("El estado debe ser 'Disponible' o 'Vendido'.", 400));
            }

            const publicacion = await publicacionesDAO.actualizarEstado(idPublicacion, estado);

            res.status(200).json({
                status: 'success',
                message: 'Estado actualizado correctamente',
                publicacion
            });

        } catch (error) {
            next(new AppError('No se pudo actualizar el estado.', 500));
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

    if (publicacionData.Subastum) {
        let pujaMayor = 0;
        let cantidadPujas = 0;

        if (publicacionData.Subastum.Pujas) {
            if (publicacionData.Subastum.Pujas.length > 0) {
                const pujas = publicacionData.Subastum.Pujas;
                pujaMayor = pujas[0].monto;
                cantidadPujas = pujas.length
            }
        }
        
        respuestaJSON.subastaData = {
            fechaInicio: publicacionData.Subastum.fechaInicio,
            fechaFin:publicacionData.Subastum.fechaFin,
            pujaMayor: pujaMayor,
            cantidadPujas: cantidadPujas
        }
    }

    return respuestaJSON;
}

module.exports = new PublicacionesController();