const { Chat } = require('../models');
const { Mensaje } = require('../models');
const { Usuario } = require('../models');
const { MensajeTexto } = require('../models');
const { MensajeImagen } = require('../models');

/**
 * Clase que gestiona el acceso a datos de los chats.
 * Proporciona métodos para crear, obtener y eliminar chats, así como
 * obtener los chats asociados a un usuario específico.
 */
class ChatsDAO {

    constructor() {

    }

    /**
     * Crea un nuevo chat en la base de datos.
     * 
     * @param {string} nombre Nombre del chat a crear
     * @param {Date} fechaCreacion Fecha de creación del chat
     * @returns {Promise<Chat>} Chat creado
     * @throws {Error} Por si hay un error al crear el chat
     */
    async crearChat(nombre, fechaCreacion, idPublicacion) {
        try {
            const chatCreado = await Chat.create({ nombre, fechaCreacion, idPublicacion });
            return chatCreado;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene un chat por su id.
     * 
     * @param {number} id Id del chat a obtener
     * @returns {Promise<Chat>} Chat encontrado
     * @throws {Error} Por si hay un error al obtener el chat
     */
    async obtenerChatPorId(id) {
        try {
            const chatObtenido = await Chat.findByPk(id);
            return chatObtenido;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todos los chats asociados a un usuario específico.
     * 
     * @param {number} idUsuario Id del usuario
     * @returns {Promise<Chat[]>} Array de chats del usuario, incluye el último mensaje de cada chat
     * @throws {Error} Por si hay un error al obtener los chats
     */
    async obtenerChatsPorUsuario(idUsuario, limit = 20, offset = 0) {
        try {
            const chats = await Chat.findAll({
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: Usuario,
                        where: { id: idUsuario },
                        attributes: [],
                        through: { attributes: [] }
                    },
                    {
                        model: Mensaje,
                        include: [
                            { model: MensajeTexto, attributes: ['texto'] },
                            { model: MensajeImagen, attributes: ['imagen'] }
                        ],
                        limit: 1,
                        order: [['fechaEnviado', 'DESC']]
                    }
                ],
                order: [['updatedAt', 'DESC']],
                subQuery: false 
            });
            return chats;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un chat por su identificador.
     * 
     * @param {number} id Id del chat a eliminar
     * @returns {Promise<string>} Mensaje de confirmación
     * @throws {Error} Por si el chat no existe o hay un error al eliminarlo
     */
    async eliminarChat(id) {
        try {
            const chatObtenido = await Chat.findByPk(id);

            if (!chatObtenido) {
                throw new Error('Chat no encontrado o no existe.');
            }
            await chatObtenido.destroy();
            return 'Chat eliminado con éxito';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ChatsDAO();