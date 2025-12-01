const MensajesDAO = require('../dataAccess/mensajesDAO.js');
const { AppError } = require('../utils/appError.js');
const ChatDAO = require('../dataAccess/chatsDAO.js');
const UsuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');

/**
 * Controlador para las operaciones relacionadas con mensajes.
 *
 * Contiene los métodos que responden a las rutas HTTP de crear y obtener los mensajes de los chats.
 */
class MensajesController {
    /**
     * Handler para crear un nuevo mensaje en un chat.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat donde se creará el mensaje
     * @param {Object} req.usuario - Usuario autenticado
     * @param {number} req.usuario.id - ID del usuario que envía el mensaje
     * @param {Object} req.body - Cuerpo de la petición (tipoMensaje)
     * @param {string} [req.body.texto] - Contenido del mensaje si es tipo texto
     * @param {string} [req.body.imagen] - URL o datos de la imagen si es tipo imagen
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async crearMensaje(req, res, next) {
        try {
            const { idChat } = req.params;
            const idUsuario = req.usuario.id || req.usuario.userId; 
            const tipoMensaje = req.body;

            const chatExists = await ChatDAO.obtenerChatPorId(idChat);
            if (!chatExists) {
                return next(new AppError('El chat no existe.', 404));
            }

            const pertenece = await UsuarioChatsDAO.esUsuarioDelChat(idUsuario, idChat);
            if (!pertenece) {
                return next(new AppError('No tienes permiso para enviar mensajes en este chat.', 403));
            }

            if (!tipoMensaje || (!tipoMensaje.texto && !tipoMensaje.imagen)) {
                return next(new AppError('Un mensaje tipo texto o imagen es requerido.', 400));
            }

            if (tipoMensaje.texto) {
                if (tipoMensaje.texto.length > 255) {
                    return next(new AppError('El mensaje no puede exceder los 255 caracteres.', 400));
                }
                if (tipoMensaje.texto.trim().length === 0) {
                    return next(new AppError('El mensaje no puede estar vacío.', 400));
                }
            }

            const mensaje = await MensajesDAO.crearMensaje(idChat, idUsuario, tipoMensaje);

            if (req.io) {
                req.io.to(`chat_${idChat}`).emit('nuevo_mensaje', mensaje.toJSON());
            }

            res.status(201).json(mensaje);

        } catch (error) {
            next(new AppError('Ocurrió un error al crear el mensaje.', 500));
        }
    }

    /**
     * Handler para obtener un mensaje específico por su ID.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idMensaje - ID del mensaje a obtener
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
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

    /**
     * Handler para obtener todos los mensajes de un chat específico.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idChat - ID del chat del cual obtener los mensajes
     * @param {Object} req.query - Query params
     * @param {number} [req.query.limit=30] - Límite de mensajes a retornar
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     */
    static async obtenerMensajesDeChat(req, res, next){
        try {
            const { idChat } = req.params;
            const idUsuarioActual = req.usuario.id || req.usuario.userId;

            const chatExists = await ChatDAO.obtenerChatPorId(idChat);
            if (!chatExists) {
                return next(new AppError('No se encontró el chat.', 404));
            }

            const pertenece = await UsuarioChatsDAO.esUsuarioDelChat(idUsuarioActual, idChat);
            if (!pertenece) {
                return next(new AppError('No tienes permiso para ver este chat.', 403));
            }

            const limit = parseInt(req.query.limit, 10) || 50;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const mensajesRaw = await MensajesDAO.obtenerMensajesDeChat(idChat, limit, offset);

            const mensajesFormateados = mensajesRaw.map(m => {
                return {
                    id: m.id,
                    texto: m.MensajeTexto ? m.MensajeTexto.texto : null,
                    imagenes: m.MensajeImagen ? [m.MensajeImagen.imagen] : [],
                    fechaEnviado: m.fechaEnviado,
                    enviado: m.idUsuario === idUsuarioActual, 
                    idChat: m.idChat
                };
            });

            res.status(200).json(mensajesFormateados);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al obtener los mensajes del chat.', 500));
        }
    }

    /**
     * Handler para eliminar un mensaje específico.
     * 
     * @param {Object} req - Request de Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.idMensaje - ID del mensaje a eliminar
     * @param {Object} req.usuario - Usuario autenticado
     * @param {number} req.usuario.id - ID del usuario que intenta eliminar el mensaje
     * @param {Object} res - Response de Express
     * @param {Function} next - Siguiente middleware
     * @returns {Promise<void>}
     * @throws {AppError} Si el usuario no es el autor del mensaje
     */
    static async eliminarMensaje(req, res, next){
        try {
            const { idMensaje } = req.params;

            const idUsuario = req.usuario.id || req.usuario.userId;

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
            console.log(error);
            next(new AppError('Ocurrió un error al eliminar el mensaje.', 500));
        }
    }
}

module.exports = MensajesController;