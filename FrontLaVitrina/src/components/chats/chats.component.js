import { ChatService } from '../../services/chat.service.js';

export class ChatsComponent extends HTMLElement {
    constructor() {
        super();
        this.chats = [];
        this.chatActual = null;
        this.mensajes = [];
        this.adjuntarIconUrl = new URL('../../assets/adjuntarImagen.png', import.meta.url).href;
        this.enviarIconUrl = new URL('../../assets/enviarMensaje.png', import.meta.url).href;
        this.cssUrl = new URL('./chats.component.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        await this.#cargarChats();

        if (this.chats.length > 0) {
            this.chatActual = this.chats[0];
            await this.#cargarMensajes(this.chatActual.id);
        }
        
        this.#render(shadow);
        this.#attachEventListeners(shadow);
    }

    async #cargarChats() {
        try {
            this.chats = await ChatService.obtenerChats();
        } catch (error) {
            console.error('Error al cargar chats:', error);
            this.chats = [];
        }
    }

    async #cargarMensajes(chatId) {
        try {
            this.mensajes = await ChatService.obtenerMensajes(chatId);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            this.mensajes = [];
        }
    }

    #render(shadow) {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="chats-container">
                <div class="chats-lista">
                    <div class="chats-header">
                        <h2>Chats</h2>
                    </div>
                    <div class="chats-items" id="chatsItems">
                        ${this.#renderChatsLista()}
                    </div>
                </div>

                <div class="chat-conversacion" id="chatConversacion">
                    ${this.chatActual ? this.#renderConversacion() : this.#renderVacio()}
                </div>
            </div>
        `;
        shadow.innerHTML = '';
        shadow.appendChild(container.firstElementChild);
        this.#agregarEstilos(shadow);
    }

    #renderChatsLista() {
        if (!this.chats || this.chats.length === 0) {
            return '<div class="chat-vacio"><p>No tienes chats.</p></div>';
        }

        return this.chats.map(chat => `
            <div class="chat-item ${this.chatActual && chat.id === this.chatActual.id ? 'active' : ''}" data-chat-id="${chat.id}">
                <img src="${chat.avatar}" alt="${chat.nombre}" class="chat-avatar">
                <div class="chat-info">
                    <div class="chat-nombre-linea">
                        <span class="chat-nombre">${chat.nombre}</span>
                        ${chat.noLeido ? '<span class="chat-badge"></span>' : ''}
                    </div>
                    <div class="chat-servicio">${chat.servicio}</div>
                    <div class="chat-ultimo-mensaje">${chat.ultimoMensaje}</div>
                </div>
            </div>
        `).join('');
    }

    #renderVacio() {
        return `
            <div class="chat-vacio">
                <p>Selecciona un chat para comenzar</p>
            </div>
        `;
    }

    #renderConversacion() {
        if (!this.chatActual) return '';

        return `
            <div class="conversacion-header">
                <img src="${this.chatActual.avatar}" alt="${this.chatActual.nombre}" class="conversacion-avatar">
                <div class="conversacion-info">
                    <h3 class="conversacion-nombre">${this.chatActual.nombre}</h3>
                    <p class="conversacion-servicio">${this.chatActual.servicio}</p>
                </div>
                <img src="${this.chatActual.productoImg}" alt="Producto" class="conversacion-producto-img">
            </div>

            <div class="mensajes-container" id="mensajesContainer">
                <div class="fecha-separador">
                    <span class="fecha-badge">Hoy</span>
                </div>
                ${this.#renderMensajes()}
            </div>

            <div class="mensaje-input-container">
                <button class="btn-adjunto" id="btnAdjunto" title="Adjuntar archivo">
                    <img src="${this.adjuntarIconUrl}" alt="Adjuntar imagen">
                </button>
                <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                <textarea 
                    class="mensaje-input" 
                    id="mensajeInput" 
                    placeholder="Escribe aquí..."
                    rows="1"
                ></textarea>
                <button class="btn-enviar" id="btnEnviar">
                    <img src="${this.enviarIconUrl}" alt="Enviar mensaje">
                </button>
            </div>
        `;
    }

    #renderMensajes() {
        if (!this.mensajes || this.mensajes.length === 0) {
            return '<div class="chat-vacio"><p>No hay mensajes aún.</p></div>';
        }

        return this.mensajes.map(mensaje => `
            <div class="mensaje ${mensaje.enviado ? 'enviado' : 'recibido'}">
                <div class="mensaje-bubble">
                    ${mensaje.texto ? `<div>${mensaje.texto}</div>` : ''}
                    
                    ${mensaje.imagenes && mensaje.imagenes.length > 0 ? `
                        <div class="mensaje-imagenes">
                            ${mensaje.imagenes.map(img => `
                                <img src="${img}" alt="Imagen" class="mensaje-imagen">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="mensaje-hora">${mensaje.hora}</div>
            </div>
        `).join('');
    }

    #attachEventListeners(shadow) {
        const chatItems = shadow.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.addEventListener('click', async () => {
                const chatId = parseInt(item.dataset.chatId);
                this.chatActual = this.chats.find(c => c.id === chatId);
                await this.#cargarMensajes(chatId);
                shadow.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                this.#actualizarConversacion(shadow);
            });
        });

        if (this.chatActual) {
            this.#attachConversacionListeners(shadow);
        }
    }

    #actualizarConversacion(shadow) {
        const conversacionContainer = shadow.getElementById('chatConversacion');
        if (conversacionContainer) {
            conversacionContainer.innerHTML = this.chatActual ? this.#renderConversacion() : this.#renderVacio();
            
            if (this.chatActual) {
                this.#attachConversacionListeners(shadow);
                this.#scrollToBottom(shadow);
            }
        }
    }

    #attachConversacionListeners(shadow) {
        const btnEnviar = shadow.getElementById('btnEnviar');
        const mensajeInput = shadow.getElementById('mensajeInput');
        const btnAdjunto = shadow.getElementById('btnAdjunto');
        const fileInput = shadow.getElementById('fileInput');

        if (btnEnviar && mensajeInput) {
            btnEnviar.addEventListener('click', () => this.#enviarMensaje(shadow));
            
            mensajeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.#enviarMensaje(shadow);
                }
            });
        }

        if (btnAdjunto && fileInput) {
            btnAdjunto.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                console.log('Archivos seleccionados:', e.target.files);
            });
        }
    }

    async #enviarMensaje(shadow) {
        const mensajeInput = shadow.getElementById('mensajeInput');
        const texto = mensajeInput.value.trim();
        
        if (!texto) return;

        try {
            await ChatService.enviarMensaje(this.chatActual.id, texto);
            await this.#cargarMensajes(this.chatActual.id);
            mensajeInput.value = '';
            this.#actualizarConversacion(shadow);
            
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    #scrollToBottom(shadow) {
        const mensajesContainer = shadow.getElementById('mensajesContainer');
        if (mensajesContainer) {
            setTimeout(() => {
                mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
            }, 50);
        }
    }

    #agregarEstilos(shadow) {
        if (!shadow.querySelector(`link[href="${this.cssUrl}"]`)) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}