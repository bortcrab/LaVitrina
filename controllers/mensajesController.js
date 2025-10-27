const MensajesDAO = require('../dataAccess/mensajesDAO.js');
const { AppError } = require('../utils/appError.js');
const ChatDAO = require('../dataAccess/chatsDAO.js');

class mensajesController {
    static async crearMensaje(req, res, next) {
        try {
            const { idChat } = req.params;
            const idUsuario = req.usuario.id || req.usuario.userId; 
            const tipoMensaje = req.body;

            if (!tipoMensaje || (!tipoMensaje.texto && !tipoMensaje.imagen)) {
                return next(new AppError('Un mensaje tipo texto o imagen es requerido.', 400));
            }

            const mensaje = await MensajesDAO.crearMensaje(idChat, idUsuario, tipoMensaje);
            res.status(201).json(mensaje);

        } catch (error) {
            next(new AppError('Ocurrió un error al crear el mensaje.', 500));
        }
    }

    static async obtenerMensajePorId(req, res, next) {
        try {
            const { idMensaje } = req.params;

            const mensaje = await MensajesDAO.obtenerMensajePorId(idMensaje);

            if (!mensaje) {
                return next(new AppError('Mensaje no encontrado.', 404));
            }

            res.status(200).json(mensaje);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener el mensaje.', 500));
        }
    }

    static async obtenerMensajesDeChat(req, res, next){
        try {
            const { idChat } = req.params;

            const chatExists = await ChatDAO.obtenerChatPorId(idChat);
            if (!chatExists) {
                return next(new AppError('No se encontró el chat.', 404));
            }

            const limit = parseInt(req.query.limit, 10) || 30;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const mensajes = await MensajesDAO.obtenerMensajesDeChat(idChat, limit, offset);

            res.status(200).json(mensajes);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener los mensajes del chat.', 500));
        }
    }

    static async eliminarMensaje(req, res, next){
        try {
            const { idMensaje } = req.params;

            const mensaje = await MensajesDAO.obtenerMensajePorId(idMensaje);
            if (!mensaje) {
                return next(new AppError('Mensaje no encontrado.', 404));
            }

            if (mensaje.idUsuario !== idUsuario) {
                return next(new AppError('El usuario no tiene permiso de eliminar este mensaje.', 403));
            }

            await MensajesDAO.eliminarMensaje(idMensaje);
            res.status(200).json({ message: 'Mensaje eliminado con exito.' });

        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar el mensaje.', 500));
        }
    }
}