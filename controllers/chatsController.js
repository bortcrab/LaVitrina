const ChatDAO = require('../dataAccess/chatsDAO.js');
const UsuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');
const UsuarioDAO = require('../dataAccess/usuariosDAO.js');
const PublicacionDAO = require('../dataAccess/publicacionesDAO.js');
const { AppError } = require('../utils/appError.js');

/**
 * Controlador para las operaciones relacionadas con chats.
 *
 * Contiene los métodos que responden a las rutas HTTP de crear, obtener, gestionar chats. 
 */
class ChatController {
    /**
     * Handler para crear un nuevo chat.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.body - Cuerpo de la petición
     * @param {string} req.body.nombre - Nombre del chat
     * @param {Date} req.body.fechaCreacion - Fecha de creación del chat
     * @param {number} req.body.idPublicacion - ID de la publicación asociada al chat
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async crearChat(req, res, next) {
        try {
            const { idPublicacion } = req.body;
            const idCliente = req.usuario.id;

            if (!idPublicacion) {
                return next(new AppError('La publicación es requerida.', 400));
            }

            const publicacion = await PublicacionDAO.obtenerPublicacionPorId(idPublicacion);

            if (!publicacion) {
                return next(new AppError('La publicación no existe.', 404));
            }
            const idVendedor = publicacion.idUsuario;
            const tituloProducto = publicacion.titulo;
            const cliente = await UsuarioDAO.obtenerUsuarioPorId(idCliente);
            const vendedor = await UsuarioDAO.obtenerUsuarioPorId(idVendedor);

            if (!cliente || !vendedor) {
                 return next(new AppError('No se pudo encontrar la información de los usuarios.', 404));
            }

            const nombreCliente = cliente.nombres;
            const nombreVendedor = vendedor.nombres;
            const nombreChat = `${nombreVendedor} - ${nombreCliente} - ${tituloProducto}`;
            const fechaCreacion = new Date();
            const chat = await ChatDAO.crearChat(nombreChat, fechaCreacion, idPublicacion);

            await UsuarioChatsDAO.agregarUsuarioAChat(idCliente, chat.id);
            await UsuarioChatsDAO.agregarUsuarioAChat(idVendedor, chat.id);

            res.status(201).json(chat);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al crear el chat.', 500));
        }
    }

    /**
     * Handler para obtener un chat por su ID.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat a obtener
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async obtenerChatPorId(req, res, next) {
        try {
            const id = req.params.idChat;
            const chat = await ChatDAO.obtenerChatPorId(id);

            if (!chat) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            res.status(200).json(chat);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener el chat.', 500))
        }
    }

    /**
     * Handler para obtener todos los chats de un usuario.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.usuario - Usuario autenticado
     * @param {number} req.usuario.userId - ID del usuario
     * @param {Object} req.query - Query params
     * @param {number} [req.query.limit=20] - Límite de resultados por página
     * @param {number} [req.query.page=1] - Número de página
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async obtenerChatsPorUsuario(req, res, next) {
        try {
            const idUsuario = req.usuario.userId || req.usuario.id;
            const limit = parseInt(req.query.limit, 10) || 20;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const chats = await ChatDAO.obtenerChatsPorUsuario(idUsuario, limit, offset);
            res.status(200).json(chats);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener los chats por usuario.', 500))
        }
    }

    /**
     * Handler para eliminar un chat específico.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat a eliminar
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async eliminarChat(req, res, next) {
        try {
            const id = req.params.idChat

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

    /**
     * Handler para agregar un usuario a un chat existente.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat al que se agregará el usuario
     * @param {Object} req.body - Cuerpo de la petición
     * @param {number} req.body.idUsuario - ID del usuario a agregar al chat
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
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
            next(new AppError('Ocurrió un error al agregar el usuario al chat.', 500));
        }
    }

    /**
     * Handler para eliminar un usuario de un chat.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat
     * @param {string} req.params.idUsuario - ID del usuario a eliminar del chat
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async eliminarUsuarioDeChat(req, res, next) {
        try {
            const { idChat, idUsuario } = req.params;

            await UsuarioChatsDAO.eliminarUsuarioDeChat(idUsuario, idChat);
            res.status(200).json({ message: 'Usuario eliminado del chat con éxito.' });

        } catch (error) {
            if (error.message === 'El usuario ya no pertenece a este chat.') {
                return next(new AppError('El usuario especificado no pertenece a este chat.', 404));
            }

            next(new AppError('Ocurrió un error al eliminar el usuario del chat.', 500));
        }
    }

}

module.exports = ChatController;