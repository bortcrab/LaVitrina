const publicacionesDAO = require("../dataAccess/publicacionesDAO.js");
const usuariosDAO = require('../dataAccess/usuariosDAO.js');
const { AppError } = require("../utils/appError.js");

class PublicacionesController {

    constructor() { }

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

    async obtenerPublicaciones(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            const publicaciones = await publicacionesDAO.obtenerPublicaciones(offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

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

            const publicaciones = await publicacionesDAO.obtenerPublicacionesPorUsuario(idUsuario, offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    async obtenerPublicacionesPorTitulo(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            //Se valida que se haya enviado el titulo por el que se buscará
            const titulo = req.query.titulo;
            if (!titulo) {
                next(new AppError('Se debe especificar el titulo por el que se desea buscar las publicaciones.', 400));
            }

            const publicaciones = await publicacionesDAO.obtenerPublicacionesPorTitulo(titulo, offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    async obtenerPublicacionesPorCategoria(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            const idCategoria = req.params.id;
            if (!idCategoria) {
                next(new AppError('Se debe especificar la categoría para realizar la búsqueda.', 400));
            }

            const publicaciones = await publicacionesDAO.obtenerPublicacionesPorCategoria(idCategoria, offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones', 500));
        }
    }

    async obtenerPublicacionesPorEtiquetas(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            let etiquetas = req.query.etiquetas;
            if (!etiquetas) {
                next(new AppError('Se debe incluir al menos una etiqueta para la búsqueda.', 400));
            }

            etiquetas = etiquetas.split(',').map(etiqueta => etiqueta.trim());

            const publicaciones = await publicacionesDAO.obtenerPublicacionesPorEtiquetas(etiquetas, offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

    async obtenerPublicacionesPorPeriodo(req, res, next) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * 20;

            const fechaInicio = new Date(req.query.inicio);
            const fechaFin = new Date(req.query.fin);

            if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                next(new AppError('Los campos fechaInicio y fechaFin son requeridos.', 400));
            }

            if (fechaInicio > fechaFin) {
                next(new AppError('Las fechas deben crear un periodo válido.', 400));
            }

            const publicaciones = await publicacionesDAO.obtenerPublicacionesPorPeriodo(fechaInicio, fechaFin, offset);
            res.status(200).json(publicaciones);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las publicaciones.', 500));
        }
    }

    async actualizarPublicacion(req, res, next) {
        try {
            const idPublicacion = req.params.id;
            console.log('----> ID PUBLICACION:', idPublicacion)
            if (!idPublicacion) {
                next(new AppError('Se debe especificar la publicación a actualizar.', 400));
            }

            const publicacionExists = await publicacionesDAO.obtenerPublicacionPorId(idPublicacion);
            console.log('----> PUBLICACION:', publicacionExists);
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

module.exports = new PublicacionesController();