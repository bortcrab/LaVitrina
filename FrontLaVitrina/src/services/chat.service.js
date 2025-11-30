import { Chat } from '../models/chat.js';
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

export class ChatService {
    static socket = null;
    static apiUrl = 'http://localhost:3000/api';
    static socketUrl = 'http://localhost:3000';
    static CLOUD_NAME = 'drczej3mh'; 
    static UPLOAD_PRESET_CHATS = 'chats_lavitrina';

    static initSocket() {
        const usuarioData = JSON.parse(localStorage.getItem('usuario')); 
        const token = localStorage.getItem('token');

        if (!token) return;

        if (this.socket && this.socket.connected) {
            return;
        }

        this.socket = io(this.socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket']
        });

        this.socket.on('connect', () => console.log('Conectado al chat server'));
        this.socket.on('connect_error', (err) => console.error('Error en la conexión del socket:', err.message));
    }

    static unirseAlChat(idChat) {
        if (this.socket) {
            this.socket.emit('join_chat', idChat);
        }
    }

    static async subirImagen(archivo) {
        const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append('file', archivo);
        formData.append('upload_preset', this.UPLOAD_PRESET_CHATS);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen del chat a Cloudinary');
            }

            const data = await response.json();
            return data.secure_url;

        } catch (error) {
            console.error('Error subiendo imagen de chat:', error);
            throw error;
        }
    }

    static async enviarImagen(idChat, archivo) {
        try {
            const urlImagen = await this.subirImagen(archivo);
            
            const token = localStorage.getItem('token');
            const res = await fetch(`${this.apiUrl}/chats/${idChat}/mensajes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imagen: urlImagen })
            });

            if (!res.ok) throw new Error('Error al guardar mensaje de imagen');
            
            const mensajeGuardado = await res.json();
            
            return {
                id: mensajeGuardado.id,
                texto: null,
                imagenes: [urlImagen],
                hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                enviado: true,
                idChat: parseInt(idChat)
            };

        } catch (error) {
            console.error("Error en flujo enviarImagen:", error);
            throw error;
        }
    }

    static enviarMensaje(idChat, texto) {
        if (this.socket) {
            this.socket.emit('enviar_mensaje', { idChat, texto });
        }
    }

    static async crearChat(idPublicacion) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${this.apiUrl}/chats`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ idPublicacion })
        });
        if (!res.ok) throw new Error('Error al crear chat');
        return await res.json();
    }

    static async obtenerChats() {
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        if (!usuarioData || !token) return [];

        try {
            const res = await fetch(`${this.apiUrl}/chats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            return data.map(c => ({
                id: c.id,
                nombre: c.nombre,
                tituloPublicacion: c.Publicacion ? c.Publicacion.titulo : 'Artículo',
                ultimoMensaje: this.#formatearUltimoMensaje(c.Mensajes?.[0]),
                fotoPerfil: this.#obtenerAvatar(c.Usuarios, usuarioData.id),
                productoImg: c.Publicacion?.ImagenesPublicacions?.[0]?.url || "https://via.placeholder.com/150",
                noLeido: this.#verificarNoLeido(c.Mensajes?.[0], usuarioData.id),
                fecha: c.Mensajes?.[0]?.fechaEnviado || c.createdAt
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async obtenerMensajes(idChat) {
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${this.apiUrl}/chats/${idChat}/mensajes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        return data.map(m => ({
            id: m.id,
            texto: m.texto,
            imagenes: m.imagenes || [],
            hora: new Date(m.fechaEnviado).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            enviado: m.enviado,
            idChat: m.idChat
        }));
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

    static #formatearUltimoMensaje(msg) {
        if (!msg) return "Inicia la conversación...";
        if (msg.MensajeTexto) return msg.MensajeTexto.texto;
        if (msg.MensajeImagen) return "📷 Foto";
        return "...";
    }

    static #obtenerAvatar(usuarios, miId) {
        const otro = usuarios?.find(u => u.id !== miId);
        return otro ? otro.fotoPerfil : 'https://i.pravatar.cc/150?img=default';
    }

    static #verificarNoLeido(msg, miId) {
        if (!msg) return false;
        return msg.idUsuario !== miId;
    }
}