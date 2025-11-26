export class ChatsComponent extends HTMLElement {
    #chats = [];
    #chatActual = null;
    #mensajes = [];

    constructor() {
        super();
        this.adjuntarIconUrl = new URL('../../assets/adjuntarImagen.png', import.meta.url).href;
        this.enviarIconUrl = new URL('../../assets/enviarMensaje.png', import.meta.url).href;
        this.cssUrl = new URL('./chats.component.css', import.meta.url).href;
    }

    set chats(data) {
        this.#chats = data;
        this.render();
    }

    setChatActivo(chatInfo, mensajes) {
        this.#chatActual = chatInfo;
        this.#mensajes = mensajes;
        this.render();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.render();
    }

    render() {
        const shadow = this.shadowRoot;
        const html = `
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
                    ${this.#chatActual ? this.#renderConversacion() : this.#renderVacio()}
                </div>
            </div>
        `;
        
        shadow.innerHTML = html;
        this.#agregarEstilos(shadow);
        this.#attachEventListeners(shadow);
        
        if(this.#chatActual) this.#scrollToBottom(shadow);
    }

    agregarMensaje(mensaje) {
        this.#mensajes.push(mensaje);
        
        const shadow = this.shadowRoot;
        const container = shadow.getElementById('mensajesContainer');
        
        if (container) {
            const divMensaje = document.createElement('div');
            divMensaje.className = `mensaje ${mensaje.enviado ? 'enviado' : 'recibido'}`;
            divMensaje.innerHTML = `
                <div class="mensaje-bubble">
                    ${mensaje.texto ? `<div>${mensaje.texto}</div>` : ''}
                    ${mensaje.imagenes && mensaje.imagenes.length > 0 ? 
                        `<div class="mensaje-imagenes"><img src="${mensaje.imagenes[0]}" class="mensaje-imagen"></div>` : ''}
                </div>
                <div class="mensaje-hora">${mensaje.hora}</div>
            `;
            container.appendChild(divMensaje);
            
            this.#scrollToBottom(shadow);
        }
    }

    #renderChatsLista() {
        if (!this.#chats.length) return '<div class="chat-vacio"><p>No tienes chats.</p></div>';

        return this.#chats.map(chat => `
            <div class="chat-item ${this.#chatActual && chat.id === this.#chatActual.id ? 'active' : ''}" 
                 data-id="${chat.id}">
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

    #renderConversacion() {
        return `
            <div class="conversacion-header">
                <img src="${this.#chatActual.avatar}" alt="${this.#chatActual.nombre}" class="conversacion-avatar">
                <div class="conversacion-info">
                    <h3 class="conversacion-nombre">${this.#chatActual.nombre}</h3>
                    <p class="conversacion-servicio">${this.#chatActual.servicio}</p>
                </div>
                <img src="${this.#chatActual.productoImg}" alt="Producto" class="conversacion-producto-img">
            </div>

            <div class="mensajes-container" id="mensajesContainer">
                <div class="fecha-separador"><span class="fecha-badge">Hoy</span></div>
                ${this.#mensajes.map(m => `
                    <div class="mensaje ${m.enviado ? 'enviado' : 'recibido'}">
                        <div class="mensaje-bubble">
                            ${m.texto ? `<div>${m.texto}</div>` : ''}
                            ${m.imagenes ? `<div class="mensaje-imagenes"><img src="${m.imagenes[0]}" class="mensaje-imagen"></div>` : ''}
                        </div>
                        <div class="mensaje-hora">${m.hora}</div>
                    </div>
                `).join('')}
            </div>

            <div class="mensaje-input-container">
                <button class="btn-adjunto">
                    <img src="${this.adjuntarIconUrl}" alt="Adjuntar">
                </button>
                <textarea class="mensaje-input" id="mensajeInput" placeholder="Escribe aquí..." rows="1"></textarea>
                <button class="btn-enviar" id="btnEnviar">
                    <img src="${this.enviarIconUrl}" alt="Enviar">
                </button>
            </div>
        `;
    }

    #renderVacio() {
        return '<div class="chat-vacio"><p>Selecciona un chat para comenzar</p></div>';
    }

    #attachEventListeners(shadow) {
        const items = shadow.querySelectorAll('.chat-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.dispatchEvent(new CustomEvent('chat-seleccionado', {
                    detail: { id },
                    bubbles: true,
                    composed: true
                }));
            });
        });

        const btnEnviar = shadow.getElementById('btnEnviar');
        const input = shadow.getElementById('mensajeInput');

        const enviar = () => {
            const texto = input.value.trim();
            if (!texto) return;
            
            this.dispatchEvent(new CustomEvent('enviar-mensaje', {
                detail: { chatId: this.#chatActual.id, texto },
                bubbles: true,
                composed: true
            }));
            input.value = '';
        };

        if (btnEnviar) {
            btnEnviar.addEventListener('click', enviar);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                }
            });
        }
    }

    #scrollToBottom(shadow) {
        const container = shadow.getElementById('mensajesContainer');
        if (container) container.scrollTop = container.scrollHeight;
    }

    #agregarEstilos(shadow) {
        if(!shadow.querySelector('link')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}