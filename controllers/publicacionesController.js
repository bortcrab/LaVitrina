const publicacionesDAO = require("../dataAccess/publicacionesDAO.js");
const { AppError } = require("../utils/appError.js");

class PublicacionesController {

    constructor() { }

    async crearPublicacion(req, res, next) {
        try {
            const { titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario } = req.body;

            console.log(req.body);

            if (!titulo || !descripcion || precio < 1) {
                next(new AppError('Los campos título, descripción y precio son obligatorios.'));
            } else if (!idCategoria) {
                next(new AppError('Se debe elegir una categoría para la publicación.'));
            } else if (!idUsuario) {
                next(new AppError('Se debe iniciar sesión para crear publicaciones.'));
            }

            const publicacion = await publicacionesDAO.crearPublicacion(titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario);

            res.status(200).json(publicacion);
        } catch (error) {
            console.log(error.message);
            next(new AppError('Ocurrió un error al crear la publicación.', 500));
        }
    }
}

module.exports = new PublicacionesController();