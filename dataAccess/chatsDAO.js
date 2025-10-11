const { Chat } = require('../models');
const { UsuarioChat } = require('../models');
const { Publicacion } = require('../models');
const { Mensaje } = require('../models');
const { Usuario } = require('../models');

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
                        include: [{
                            model: MensajeTexto,
                            attributes: ['texto'],
                        }],
                        limit: 1,
                        order: [['fechaEnviado', 'DESC']]
                    }]
                }]
            });

            if (!usuario || !usuario.Chats) {
                return [];
            }

            const chats = usuario.Chats;

            chats.sort((a, b) => {
                const ultimoMensajeA = a.Mensajes[0];
                const ultimoMensajeB = b.Mensajes[0];

                if (!ultimoMensajeA) return 1;
                if (!ultimoMensajeB) return -1;

                return new Date(ultimoMensajeB.fechaEnviado) - new Date(ultimoMensajeA.fechaEnviado);
            });

            const chatsFormateados = chats.map(chat => {
                const ultimoMensaje = chat.Mensajes[0];
                const textoMensaje = ultimoMensaje && ultimoMensaje.MensajeTexto
                    ? ultimoMensaje.MensajeTexto.texto
                    : ' ';

                return {
                    id: chat.id,
                    nombre: chat.nombre,
                    ultimoMensaje: textoMensaje,
                    horaUltimoMensaje: ultimoMensaje ? ultimoMensaje.fechaEnviado : null
                };
            });

            return chatsFormateados;

        } catch (error) {
            throw error;
        }
    }

    async eliminarChat(id) {
        try {
            const chatObtenido = await Chat.findByPk(id);
    
            if(!chatObtenido) {
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