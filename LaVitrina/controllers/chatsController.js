const ChatDAO = require('../dataAccess/chatsDAO.js');
const UsuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');
const UsuarioDAO = require('../dataAccess/usuariosDAO.js');
const PublicacionDAO = require('../dataAccess/publicacionesDAO.js');
const { AppError } = require('../utils/appError.js');

class ChatController {

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
            
            if (idCliente == idVendedor) {
                 return next(new AppError('No puedes crear un chat contigo mismo.', 400));
            }

            const chatExistente = await ChatDAO.buscarChatExistente(idPublicacion, idCliente, idVendedor);
            
            if (chatExistente) {
                return res.status(200).json(chatExistente);
            }

            const cliente = await UsuarioDAO.obtenerUsuarioPorId(idCliente);
            const vendedor = await UsuarioDAO.obtenerUsuarioPorId(idVendedor);

            if (!cliente || !vendedor) {
                 return next(new AppError('No se pudo encontrar la información de los usuarios.', 404));
            }

            const nombreChat = `${vendedor.nombres} - ${cliente.nombres} - ${publicacion.titulo}`;
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

    static async obtenerChatPorId(req, res, next) {
        try {
            const idChat = req.params.idChat;
            const idUsuario = req.usuario.id;

            const chat = await ChatDAO.obtenerChatPorId(idChat);

            if (!chat) {
                return next(new AppError('Chat no encontrado.', 404))
            }

            const pertenece = await UsuarioChatsDAO.esUsuarioDelChat(idUsuario, idChat);
            if (!pertenece) {
                return next(new AppError('No tienes permiso para ver este chat.', 403));
            }

            res.status(200).json(chat);

        } catch (error) {
            next(new AppError('Ocurrió un error al obtener el chat.', 500))
        }
    }

    static async obtenerChatsPorUsuario(req, res, next) {
        try {
            const idUsuarioActual = req.usuario.userId || req.usuario.id;
            const limit = parseInt(req.query.limit, 10) || 20;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const chatsRaw = await ChatDAO.obtenerChatsPorUsuario(idUsuarioActual, limit, offset);

            const chatsFormateados = chatsRaw.map(chat => {
                
                const usuarios = chat.Usuarios || [];
                const otroUsuario = usuarios.find(u => u.id !== idUsuarioActual);
                
                const avatar = otroUsuario ? otroUsuario.fotoPerfil : 'https://i.pravatar.cc/150?img=default';
                
                const nombreOtroUsuario = otroUsuario 
                    ? `${otroUsuario.nombres} ${otroUsuario.apellidoPaterno || ''}`.trim()
                    : 'Usuario Desconocido';

                const tituloPublicacion = chat.Publicacion ? chat.Publicacion.titulo : 'Artículo';

                const nombreMostrar = nombreOtroUsuario;

                const servicioMostrar = tituloPublicacion;

                let productoImg = "https://via.placeholder.com/150?text=Sin+Foto";
                if (chat.Publicacion && chat.Publicacion.ImagenesPublicacions && chat.Publicacion.ImagenesPublicacions.length > 0) {
                    productoImg = chat.Publicacion.ImagenesPublicacions[0].url;
                }

                let ultimoMensajeTexto = "Inicia la conversación...";
                let noLeido = false;
                let fechaUltimoMensaje = chat.createdAt;

                if (chat.Mensajes && chat.Mensajes.length > 0) {
                    const msg = chat.Mensajes[0];
                    fechaUltimoMensaje = msg.fechaEnviado;

                    if (msg.MensajeTexto) {
                        ultimoMensajeTexto = msg.MensajeTexto.texto;
                    } else if (msg.MensajeImagen) {
                        ultimoMensajeTexto = "📷 Foto";
                    }

                    if (msg.idUsuario !== idUsuarioActual) {
                        noLeido = true; 
                    }
                }

                return {
                    id: chat.id,
                    nombre: nombreMostrar,
                    tituloPublicacion: servicioMostrar,
                    ultimoMensaje: ultimoMensajeTexto,
                    fotoPerfil: avatar,
                    productoImg: productoImg,
                    noLeido: noLeido,
                    fecha: fechaUltimoMensaje
                };
            });

            res.status(200).json(chatsFormateados);

        } catch (error) {
            console.error(error);
            next(new AppError('Ocurrió un error al obtener los chats por usuario.', 500))
        }
    }

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
            console.error(error);
            next(new AppError('Ocurrió un error al eliminar el chat.', 500))
        }
    }

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