const { Mensaje } = require('../models');
const { MensajeTexto } = require('../models');
const { MensajeImagen } = require('../models');
const { Usuario } = require('../models');

/**
 * Clase que gestiona el acceso a datos de los mensajes.
 * Permite la creación, obtención y eliminación de mensajes, ya sean
 * de tipo texto o imagen.
 */
class MensajesDAO {

    constructor() {

    }

    /**
     * Crea un nuevo mensaje en un chat.
     * 
     * @param {number} idChat Id del chat donde se creará el mensaje
     * @param {number} idUsuario Id del usuario que envía el mensaje
     * @param {Object} tipo Objeto que especifica el tipo de mensaje
     * @param {string} [tipo.texto] Contenido del mensaje si es de tipo texto
     * @param {string} [tipo.imagen] URL o datos de la imagen si es de tipo imagen
     * @returns {Promise<Mensaje>} Mensaje creado con sus relaciones
     * @throws {Error} Por si el tipo de mensaje no es válido o hay un error en la creación
     */
    async crearMensaje(idChat, idUsuario, tipo) {
        try {
            const mensajeNuevo = await Mensaje.create({
                fechaEnviado: new Date(),
                idChat,
                idUsuario
            });

            if(tipo.texto) {
                await MensajeTexto.create({
                    id: mensajeNuevo.id,
                    texto: tipo.texto
                })
            } else if(tipo.imagen) {
                await MensajeImagen.create({
                    id: mensajeNuevo.id,
                    imagen: tipo.imagen
                })
            } else {
                throw new Error('El tipo de mensaje no es válido.')
            }

            return this.obtenerMensajePorId(mensajeNuevo.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene un mensaje específico por su ID.
     * 
     * @param {number} id Id del mensaje a obtener
     * @returns {Promise<Mensaje>} Mensaje encontrado con sus relaciones (usuario y contenido)
     * @throws {Error} Por si hay un error al obtener el mensaje
     */
    async obtenerMensajePorId(id) {
        try {
            const mensaje = await Mensaje.findByPk(id, {
                include: [
                    { model: Usuario, attributes: ['id', 'nombres', 'fotoPerfil'] },
                    { model: MensajeTexto, attributes: ['texto'] },
                    { model: MensajeImagen, attributes: ['imagen'] }
                ]
            });
            return mensaje;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todos los mensajes de un chat específico.
     * 
     * @param {number} idChat Id del chat del cual obtener los mensajes
     * @returns {Promise<Mensaje[]>} Array de mensajes ordenados por fecha de envío
     * @throws {Error} Por si hay un error al obtener los mensajes
     */
    async obtenerMensajesDeChat(idChat, limit = 30, offset = 0) {
        try {
            const mensajes = await Mensaje.findAll({
                where: { idChat },
                include: [
                    { model: Usuario, attributes: ['id', 'nombres'] },
                    { model: MensajeTexto, attributes: ['texto'] },
                    { model: MensajeImagen, attributes: ['imagen'] }
                ],
                order: [['fechaEnviado', 'ASC']],
                limit: limit,
                offset: offset
            });
            return mensajes;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un mensaje por su ID.
     * 
     * @param {number} id Id del mensaje a eliminar
     * @returns {Promise<string>} Mensaje de confirmación
     * @throws {Error} Por si el mensaje no existe o hay un error al eliminarlo
     */
    async eliminarMensaje(id) {
        try {
            const mensaje = await Mensaje.findByPk(id);
            if (!mensaje) {
                throw new Error('El mensaje no existe o ya fue eliminado.');
            }
            await mensaje.destroy();
            return 'Mensaje eliminado con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MensajesDAO();