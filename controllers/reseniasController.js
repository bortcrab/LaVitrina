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

}
module.exports = ReseniasController;