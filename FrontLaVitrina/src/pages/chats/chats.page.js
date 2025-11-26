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

            if (this.chats.length > 0) {
                await this.#cargarMensajesDeChat(this.chats[0].id, component);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async #cargarMensajesDeChat(chatId, component) {
        try {
            this.chatActual = this.chats.find(c => c.id === chatId);
            ChatService.unirseAlChat(chatId);
            const mensajes = await ChatService.obtenerMensajes(chatId);
            component.setChatActivo(this.chatActual, mensajes);

            ChatService.escucharNuevosMensajes((nuevoMensaje) => {
                if (this.chatActual && this.chatActual.id === nuevoMensaje.idChat) {
                    component.agregarMensaje(nuevoMensaje);
                }
            });

        } catch (error) {
            console.error(error);
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
    }
}