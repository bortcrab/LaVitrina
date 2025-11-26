import { Chat } from '../models/chat.js';
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

export class ChatService {
    static socket = null;
    static apiUrl = 'http://localhost:3000/api';
    static socketUrl = 'http://localhost:3000';

    static initSocket() {
        const usuarioData = JSON.parse(localStorage.getItem('usuario')); 
        const token = usuarioData?.token;

        if (!token) return;

        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(this.socketUrl, {
            auth: { token: `Bearer ${token}` }
        });

        this.socket.on('connect', () => console.log('Conectado al chat server'));
        this.socket.on('connect_error', (err) => console.error('Error conexión socket:', err.message));
    }

    static unirseAlChat(idChat) {
        if (this.socket) {
            this.socket.emit('join_chat', idChat);
        }
    }

    static async obtenerChats() {
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioData) return [];

        try {
            const res = await fetch(`${this.apiUrl}/chats`, {
                headers: { 'Authorization': `Bearer ${usuarioData.token}` }
            });
            const data = await res.json();
            
            return data.map(c => {
                const chatObj = new Chat(
                    c.id, c.nombre, c.fechaCreacion, c.idPublicacion, c.Usuarios, c.Mensajes, c.Publicacion
                );
                
                return {
                    id: chatObj.id,
                    nombre: chatObj.getNombreMostrar(usuarioData.id),
                    servicio: chatObj.getServicioMostrar(),
                    ultimoMensaje: chatObj.getUltimoMensajeTexto(),
                    avatar: chatObj.getAvatar(usuarioData.id),
                    productoImg: chatObj.getProductoImg(),
                    noLeido: !chatObj.esUltimoMensajeMio(usuarioData.id)
                };
            });
        } catch (e) {
            console.error("Error obteniendo chats:", e);
            return [];
        }
    }

    static async obtenerMensajes(idChat) {
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        try {
            const res = await fetch(`${this.apiUrl}/chats/${idChat}/mensajes`, {
                headers: { 'Authorization': `Bearer ${usuarioData.token}` }
            });
            const data = await res.json();

            return data.map(m => ({
                id: m.id,
                texto: m.MensajeTexto?.texto,
                imagenes: m.MensajeImagen ? [m.MensajeImagen.imagen] : [],
                hora: new Date(m.fechaEnviado).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                enviado: m.idUsuario === usuarioData.id,
                idChat: m.idChat
            }));
        } catch (e) {
            console.error("Error obteniendo mensajes:", e);
            return [];
        }
    }

    static enviarMensaje(idChat, texto) {
        if (this.socket) {
            this.socket.emit('enviar_mensaje', { idChat, texto });
        }
    }
    
    static escucharNuevosMensajes(callback) {
        if (!this.socket) return;
        
        this.socket.off('nuevo_mensaje');
        this.socket.on('nuevo_mensaje', (msgBackend) => {
            const usuarioData = JSON.parse(localStorage.getItem('usuario'));
            
            const msgFormateado = {
                id: msgBackend.id,
                texto: msgBackend.MensajeTexto?.texto,
                imagenes: msgBackend.MensajeImagen ? [msgBackend.MensajeImagen.imagen] : [],
                hora: new Date(msgBackend.fechaEnviado).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                enviado: msgBackend.idUsuario === usuarioData.id,
                idChat: msgBackend.idChat
            };
            callback(msgFormateado);
        });
    }
}