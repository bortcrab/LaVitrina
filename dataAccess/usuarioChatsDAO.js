const { UsuarioChat } = require('../models');
const { Usuario } = require('../models');
const { Chat } = require('../models');

class UsuarioChatsDAO {

    constructor() {

    }

    async agregarUsuarioAChat(idUsuario, idChat) {
        try {
            const nuevaRelacion = await UsuarioChat.create({ idUsuario, idChat });
            return nuevaRelacion;
            
        } catch (error) {
            throw error;
        }
    }

    async eliminarUsuarioDeChat(idUsuario, idChat) {
        try {
            const relacion = await UsuarioChat.findOne({ where: { idUsuario, idChat } });
            
            if (!relacion) {
                throw new Error('El usuario ya no pertenece a este chat.');
            }
            
            await relacion.destroy();
            return 'Usuario eliminado del chat con éxito.';

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UsuarioChatsDAO();