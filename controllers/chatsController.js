const ChatDAO = require('../dataAccess/chatsDAO.js');
const { AppError } = require('../utils/appError.js');

class ChatController {
    static async crearChat(req, res, next) {
        try {
            const { nombre, fechaCreacion, idPublicacion } = req.body;

            if(!nombre || !fechaCreacion || !idPublicacion) {
                return next(new AppError('Los campos nombre y fecha creación son requeridos.', 400))
            }

            const chat = await ChatDAO.crearChat(nombre, fechaCreacion, idPublicacion);
            res.status(201).json(chat);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al crear el chat.', 500))
        }
    }

    static async obtenerChatPorId(req, res, next) {
        try {
            const id = req.params.id;
            const chat = await ChatDAO.obtenerChatPorId(id);

            if(!chat) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            res.status(200).json(chat);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener el chat.', 500))
        }
    }

    static async obtenerChatsPorUsuario(req, res, next) {
        try {
            if(!req.usuario || !req.usuario.id) {
                return next(new AppError('No hay un usuario con sesión iniciada.', 401))
            }

            //const idUsuario = req.usuario.id;
            const idUsuario = 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const chats = await ChatDAO.obtenerChatsPorUsuario(idUsuario, limit, offset);

            res.status(200).json(chats);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener los chats por usuario.', 500))
        }
    }

    static async eliminarChat(req, res, next) {
        try {
            const id = req.params.id;

            const chatExists = await ChatDAO.obtenerChatPorId(id);

            if(!chatExists) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            await ChatDAO.eliminarChat(id)

            res.status(200).json({ message: 'Chat eliminado con exito.' })

        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar el chat.', 500))
        }
    }

}

module.exports = ChatController;