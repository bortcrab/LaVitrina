const { Chat } = require('../models');
const { Mensaje } = require('../models');
const { Usuario } = require('../models');
const { MensajeTexto } = require('../models');
const { MensajeImagen } = require('../models');

class ChatsDAO {

    constructor() {

    }

    async crearChat(nombre, fechaCreacion) {
        try {
            const chatCreado = await Chat.create({ nombre, fechaCreacion });
            return chatCreado;
        } catch (error) {
            throw error;
        }
    }

    async obtenerChatPorId(id) {
        try {
            const chatObtenido = await Chat.findByPk(id);
            return chatObtenido;
        } catch (error) {
            throw error;
        }
    }

    async obtenerChatsPorUsuario(idUsuario) {
        try {
            const usuario = await Usuario.findByPk(idUsuario, {
                include: [{
                    model: Chat,
                    include: [{
                        model: Mensaje,
                        include: [
                            { model: MensajeTexto, attributes: ['texto'] },
                            { model: MensajeImagen, attributes: ['imagen'] }
                        ],
                        limit: 1,
                        order: [['fechaEnviado', 'DESC']]
                    }]
                }]
            });

            if(usuario) {
                return usuario.Chats;
            } else {
                return [];
            }

        } catch (error) {
            throw error;
        }
    }

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