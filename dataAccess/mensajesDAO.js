const { Mensaje } = require('../models');
const { MensajeTexto } = require('../models');
const { MensajeImagen } = require('../models');
const { Usuario } = require('../models');

class MensajesDAO {

    constructor() {

    }

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
                throw new Error('El contenido del mensaje no es válido.')
            }

            return this.obtenerMensajePorId(mensajeNuevo.id);
        } catch (error) {
            throw error;
        }
    }

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

    async obtenerMensajesDeChat(idChat) {
        try {
            const mensajes = await Mensaje.findAll({
                where: { idChat },
                include: [
                    { model: Usuario, attributes: ['id', 'nombres'] },
                    { model: MensajeTexto, attributes: ['texto'] },
                    { model: MensajeImagen, attributes: ['imagen'] }
                ],
                order: [['fechaEnviado', 'ASC']]
            });
            return mensajes;
        } catch (error) {
            throw error;
        }
    }

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