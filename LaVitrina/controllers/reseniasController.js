const reseniasDAO = require('../dataAccess/reseniasDAO.js');
const usuariosDAO = require('../dataAccess/usuariosDAO.js');
const { AppError } = require('../utils/appError.js');

class ReseniasController {

    constructor() { }

    async crearResenia(req, res, next) {
        console.log("bro al menosllegamosalcontroller");
        try {
            const idUsuarioReseniado = req.params.id;
            const { idUsuarioCreador, titulo, descripcion, calificacion } = req.body;
            const errores = [];
            if (!idUsuarioCreador || !idUsuarioReseniado || !titulo || !descripcion || !calificacion) {
                return next(new AppError('Todos los campos son requeridos', 400));
            }

            if (!await usuariosDAO.obtenerUsuarioPorId(idUsuarioCreador)) {
                return next(new AppError('Debes iniciar sesión.', 500));
            }
            if (!await usuariosDAO.obtenerUsuarioPorId(idUsuarioReseniado)) {
                return next(new AppError('No se ha encontrado el usuario que quieres reseñar.', 500));
            }
            if (idUsuarioCreador === idUsuarioReseniado) {
                return next(new AppError('No te puedes reseñar a ti mismo.', 400));
            }

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

            // Validar calificacion
            if (calificacion < 1 || calificacion > 5) {
                errores.push("Favor de ingresar una calificación válida.");
            }

            // Si hay errores, rechazar
            if (errores.length > 0) {
                console.error('ReseniasController: Errores de validación:', errores);
                return next(new AppError(errores, 400));
            }

            const nuevaResenia = await reseniasDAO.crearResenia({
                idUsuarioCreador,
                idUsuarioReseniado,
                titulo,
                descripcion,
                calificacion,
                fechaResenia: new Date()
            });

            res.status(201).json(nuevaResenia);
        } catch (error) {
            console.log(error);
            next(new AppError('Ocurrió un error al crear la reseña', 500));
        }
    }

    async obtenerResenias(req, res, next) {
        try {
            const resenias = await reseniasDAO.obtenerResenias();

            res.status(200).json(resenias);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    async obtenerReseniaPorId(req, res, next) {
        try {
            const id = req.params.id;
            const resenia = await reseniasDAO.obtenerReseniaPorId(id);

            if (!resenia) {
                return next(new AppError('Reseña no encontrada', 404));
            }
            res.status(200).json(resenia);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener la reseña', 500));
        }
    }

    async obtenerReseniasPorUsuarioReseniado(req, res, next) {
        try {
            const idUsuarioReseniado = req.params.idUsuarioReseniado;
            const resenias = await reseniasDAO.obtenerReseniasPorUsuarioReseniado(idUsuarioReseniado);

            let datosUsuario = null;
            let puntuacion = 0;

            if (resenias.length > 0) {
                const primerResenia = resenias[0];

                datosUsuario = primerResenia.UsuarioReseniado;

                const sumaCalificaciones = resenias.reduce((acumulador, r) => acumulador + r.calificacion, 0);
                puntuacion = sumaCalificaciones / resenias.length;

                puntuacion = parseFloat(puntuacion.toFixed(1));
            } else {
                return res.status(200).json({
                    usuario: null,
                    puntuacion: 0,
                    resenias: []
                });
            }

            const respuesta = {
                usuario: {
                    id: datosUsuario.id,
                    nombres: datosUsuario.nombres,
                    apellidoPaterno: datosUsuario.apellidoPaterno,
                    apellidoMaterno: datosUsuario.apellidoMaterno,
                    fotoPerfil: datosUsuario.fotoPerfil,
                    puntuacion: puntuacion
                },
                resenias: resenias
            };

            res.status(200).json(respuesta);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    async obtenerReseniasMasAltas(req, res, next) {
        try {
            const id = req.params.idUsuarioReseniado;
            const resenias = await reseniasDAO.obtenerReseniasMasAltas(id);
            if (resenias.length === 0) {
                return next(new AppError('No se encontraron reseñas', 404));
            }

            res.status(200).json(resenias);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    async obtenerReseniasMasBajas(req, res, next) {
        try {
            const id = req.params.idUsuarioReseniado;
            const resenias = await reseniasDAO.obtenerReseniasMasBajas(id);
            if (resenias.length === 0) {
                return next(new AppError('No se encontraron reseñas', 404));
            }
            res.status(200).json(resenias);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las reseñas', 500));
        }
    }

    async actualizarResenia(req, res, next) {
        try {
            const id = req.params.id;
            const { titulo, descripcion, calificacion } = req.body;
            const reseniaExistente = await reseniasDAO.obtenerReseniaPorId(id);
            if (!reseniaExistente) {
                return next(new AppError('Reseña no encontrada', 404));
            }
            const reseniaActualizada = await reseniasDAO.actualizarResenia(id, {
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

    async eliminarResenia(req, res, next) {
        try {
            const id = req.params.id;
            const reseniaExistente = await reseniasDAO.obtenerReseniaPorId(id);
            if (!reseniaExistente) {
                return next(new AppError('Reseña no encontrada', 404));
            }
            await reseniasDAO.eliminarResenia(id);
            res.status(200).json({ message: 'Reseña eliminada correctamente' });
        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar la reseña', 500));
        }
    }
}

module.exports = new ReseniasController();