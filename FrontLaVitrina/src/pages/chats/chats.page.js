import { ChatService } from '../../services/chat.service.js';

export class ChatsPage extends HTMLElement {
    constructor() {
        super();
        this.chats = [];
        this.chatActual = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        ChatService.initSocket();
        this.#inicializar(shadow);
        this.#agregarListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `<chats-info id="chatsComponent"></chats-info>`;
    }

    async #inicializar(shadow) {
        const component = shadow.getElementById('chatsComponent');
        try {
            this.chats = await ChatService.obtenerChats();
            component.chats = this.chats;

            const chatAbiertoId = localStorage.getItem('chatAbiertoId');
            
            if (chatAbiertoId) {
                localStorage.removeItem('chatAbiertoId');
                await this.#cargarMensajesDeChat(parseInt(chatAbiertoId), component);
            }

            ChatService.escucharNuevosMensajes((nuevoMensaje) => {
                this.#manejarNuevoMensaje(nuevoMensaje, component);
            });

        } catch (error) {
            console.error(error);
            if (component && component.mostrarError) {
                component.mostrarError("Error de conexión", "No pudimos cargar tus chats. Verifica tu internet.");
            }
        }
    }

    async #cargarMensajesDeChat(chatId, component) {
        try {
            this.chatActual = this.chats.find(c => c.id === chatId);
            ChatService.unirseAlChat(chatId);
            const mensajes = await ChatService.obtenerMensajes(chatId);
            component.setChatActivo(this.chatActual, mensajes);
        } catch (error) {
            console.error(error);
            if (component && component.mostrarError) {
                component.mostrarError("Error al cargar conversación", error.message);
            }
        }
    }

    #manejarNuevoMensaje(nuevoMensaje, component) {
        if (this.chatActual && this.chatActual.id === nuevoMensaje.idChat) {
            component.agregarMensaje(nuevoMensaje);
        }

        const chatIndex = this.chats.findIndex(c => c.id === nuevoMensaje.idChat);
        if (chatIndex !== -1) {
            const chat = this.chats[chatIndex];
            chat.ultimoMensaje = nuevoMensaje.texto || "📷 Foto";
            
            if (!this.chatActual || this.chatActual.id !== nuevoMensaje.idChat) {
                chat.noLeido = true;
            }

            this.chats.splice(chatIndex, 1);
            this.chats.unshift(chat);
            component.chats = [...this.chats];
        }
    }

    #agregarListeners(shadow) {
        const component = shadow.getElementById('chatsComponent');

        component.addEventListener('chat-seleccionado', async (e) => {
            const chatId = e.detail.id;
            await this.#cargarMensajesDeChat(chatId, component);
        });

        component.addEventListener('enviar-mensaje', async (e) => {
            const { chatId, texto } = e.detail;
            ChatService.enviarMensaje(chatId, texto);
        });

        component.addEventListener('enviar-imagen', async (e) => {
            const { chatId, archivo } = e.detail;
            
            try {
                const mensajeEnviado = await ChatService.enviarImagen(chatId, archivo);
                
                this.#manejarNuevoMensaje(mensajeEnviado, component);
                
            } catch (error) {
                console.error(error);
                if (component && component.mostrarError) {
                    component.mostrarError("Error al enviar", "No pudimos enviar la imagen. Inténtalo de nuevo.");
                }
            }
        });
    }
}