const ReseniaDAO = require('../dataAccess/reseniasDAO.js');
const { AppError } = require('../utils/appError.js');

class ReseniasController {
    static async crearResenia(req, res, next) {
        try {
            const { idUsuarioCreador, idUsuarioReseniado, titulo, descripcion, calificacion } = req.body;

            if (!idUsuarioCreador || !idUsuarioReseniado || !titulo || !descripcion || !calificacion) {
                return next(new AppError('Todos los campos son requeridos', 400));
            }

            const nuevaResenia = await ReseniaDAO.crearResenia({
                idUsuarioCreador,
                idUsuarioReseniado,
                titulo,
                descripcion,
                calificacion,
                fechaResenia: new Date()
            });

            res.status(201).json(nuevaResenia);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la reseña', 500));
        }
    }

    static async obtenerResenias(req, res, next) {
        try {
            const resenias = await ReseniaDAO.obtenerResenias();

            res.status(200).json(resenias);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    static async obtenerReseniaPorId(req, res, next) {
        try {
            const id = req.params.id;
            const resenia = await ReseniaDAO.obtenerReseniaPorId(id);

            if (!resenia) {
                return next(new AppError('Reseña no encontrada', 404));
            }
            res.status(200).json(resenia);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la reseña', 500));
        }
    }

    static async obtenerReseniasPorUsuarioReseniado(req, res, next) {
        try {
            const idUsuarioReseniado = req.params.idUsuarioReseniado;
            const resenias = await ReseniaDAO.obtenerReseniasPorUsuarioReseniado(idUsuarioReseniado);

            res.status(200).json(resenias);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    static async obtenerReseniasMasAltas(req, res, next) {
        try {
            const id = req.params.idUsuarioReseniado;
            const resenias = await ReseniaDAO.obtenerReseniasMasAltas(id);
            if (resenias.length === 0) {
                return next(new AppError('No se encontraron reseñas', 404));
            }

            res.status(200).json(resenias);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    static async obtenerReseniasMasBajas(req, res, next) {
        try {
            const id = req.params.idUsuarioReseniado;
            const resenias = await ReseniaDAO.obtenerReseniasMasBajas(id);
            if (resenias.length === 0) {
                return next(new AppError('No se encontraron reseñas', 404));
            }   
            res.status(200).json(resenias);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    static async actualizarResenia(req, res, next) {
        try {
            const id = req.params.id;
            const { titulo, descripcion, calificacion } = req.body;     
            const reseniaExistente = await ReseniaDAO.obtenerReseniaPorId(id);
            if (!reseniaExistente) {
                return next(new AppError('Reseña no encontrada', 404));
            }
            const reseniaActualizada = await ReseniaDAO.actualizarResenia(id, {
                titulo,
                descripcion,
                calificacion,
                fechaResenia: new Date()
            });
            res.status(200).json(reseniaActualizada);
        } catch (error) {
            next(new AppError('Ocurrió un error al actualizar la reseña', 500));
        }
    }


}

module.exports = ReseniasController;