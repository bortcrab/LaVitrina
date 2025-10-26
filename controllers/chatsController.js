const ChatDAO = require('../dataAccess/chatsDAO.js');
const UsuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');
const UsuarioDAO = require('../dataAccess/usuariosDAO.js');
const { AppError } = require('../utils/appError.js');

class ChatController {
    static async crearChat(req, res, next) {
        try {
            const { nombre, fechaCreacion, idPublicacion } = req.body;

            if (!nombre || !fechaCreacion || !idPublicacion) {
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

            if (!chat) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            res.status(200).json(chat);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener el chat.', 500))
        }
    }

    static async obtenerChatsPorUsuario(req, res, next) {
        try {
            const idUsuario = req.usuario.userId || req.usuario.id;
            const limit = parseInt(req.query.limit, 10) || 20;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const chats = await ChatDAO.obtenerChatsPorUsuario(idUsuario, limit, offset);

            res.status(200).json(chats);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al obtener los chats por usuario.', 500))
        }
    }

    static async eliminarChat(req, res, next) {
        try {
            const id = req.params.id;

            const chatExists = await ChatDAO.obtenerChatPorId(id);

            if (!chatExists) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            await ChatDAO.eliminarChat(id)

            res.status(200).json({ message: 'Chat eliminado con exito.' })

        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar el chat.', 500))
        }
    }

    static async agregarUsuarioAChat(req, res, next) {
        try {
            const { idChat } = req.params;
            const { idUsuario } = req.body;

            if (!idUsuario || !idChat) {
                return next(new AppError('El idChat y idUsuario son requeridos.', 400));
            }

            const chatExiste = await ChatDAO.obtenerChatPorId(idChat);
            const usuarioExiste = await UsuarioDAO.obtenerUsuarioPorId(idUsuario);

            if (!chatExiste || !usuarioExiste) {
                return next(new AppError('El chat o el usuario proporcionado no existe.', 404));
            }

            const nuevaRelacion = await UsuarioChatsDAO.agregarUsuarioAChat(idUsuario, idChat);

            res.status(201).json(nuevaRelacion);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al agregar el usuario al chat.', 500));
        }
    }

    static async eliminarUsuarioDeChat(req, res, next) {
        try {
            const { idChat, idUsuario } = req.params;

            await UsuarioChatsDAO.eliminarUsuarioDeChat(idUsuario, idChat);

            res.status(200).json({ message: 'Usuario eliminado del chat con éxito.' });

        } catch (error) {
            if (error.message === 'El usuario ya no pertenece a este chat.') {
                return next(new AppError('El usuario especificado no pertenece a este chat.', 404));
            }

            console.error(error);
            next(new AppError('Ocurrió un error al eliminar el usuario del chat.', 500));
        }
    }

}

module.exports = ChatController;