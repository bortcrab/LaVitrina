const { UsuarioChat } = require('../models');
const { Usuario } = require('../models');
const { Chat } = require('../models');

/**
 * Clase que gestiona la relación entre usuarios y chats.
 * Maneja las relaciones entre usuarios y chats específicos.
 */
class UsuarioChatsDAO {

    constructor() {

    }

    /**
     * Agrega un usuario a un chat específico.
     * 
     * @param {number} idUsuario Id del usuario a agregar
     * @param {number} idChat Id del chat al que se agregará el usuario
     * @returns {Promise<UsuarioChat>} Relación creada entre usuario y chat
     * @throws {Error} Por si hay un error al crear la relación
     */
    async agregarUsuarioAChat(idUsuario, idChat) {
        try {
            const nuevaRelacion = await UsuarioChat.create({ idUsuario, idChat });
            return nuevaRelacion;
            
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un usuario de un chat específico.
     * 
     * @param {number} idUsuario Id del usuario a eliminar del chat
     * @param {number} idChat Id del chat del cual se eliminará el usuario
     * @returns {Promise<string>} Mensaje de confirmación
     * @throws {Error} Por si el usuario no pertenece al chat o hay un error al eliminarlo
     */
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