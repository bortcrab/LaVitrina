const { Chat, Mensaje, Usuario, MensajeTexto, MensajeImagen, Publicacion, ImagenesPublicacion, UsuarioChat } = require('../models');
const { Op } = require('sequelize');

class ChatsDAO {

    constructor() {}

    async crearChat(nombre, fechaCreacion, idPublicacion) {
        try {
            const chatCreado = await Chat.create({ nombre, fechaCreacion, idPublicacion });
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

    async obtenerChatsPorUsuario(idUsuario, limit = 20, offset = 0) {
        try {
            const relaciones = await UsuarioChat.findAll({
                where: { idUsuario: idUsuario },
                attributes: ['idChat']
            });
            
            const chatIds = relaciones.map(r => r.idChat);

            if (chatIds.length === 0) return [];

            const chats = await Chat.findAll({
                where: {
                    id: { [Op.in]: chatIds }
                },
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: Usuario,
                        attributes: ['id', 'nombres', 'apellidoPaterno', 'fotoPerfil'],
                        through: { attributes: [] }
                    },
                    {
                        model: Publicacion,
                        attributes: ['id', 'titulo'], 
                        include: [{
                            model: ImagenesPublicacion,
                            limit: 1,
                            attributes: ['url']
                        }]
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
            console.log(error);
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

    async buscarChatExistente(idPublicacion, idUsuario1, idUsuario2) {
        try {
            const chats = await Chat.findAll({
                where: { idPublicacion },
                include: [{
                    model: Usuario,
                    attributes: ['id']
                }]
            });

            const chatExistente = chats.find(chat => {
                const usuariosDelChat = chat.Usuarios.map(u => u.id);
                const incluyeUsuario1 = usuariosDelChat.includes(parseInt(idUsuario1));
                const incluyeUsuario2 = usuariosDelChat.includes(parseInt(idUsuario2));
                return incluyeUsuario1 && incluyeUsuario2;
            });

            return chatExistente || null;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ChatsDAO();