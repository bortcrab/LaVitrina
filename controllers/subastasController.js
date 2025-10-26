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
}

module.exports = new SubastasController();