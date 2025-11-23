import { ChatService } from '../../services/chat.service.js';

export class ChatsComponent extends HTMLElement {
    constructor() {
        super();
        this.chats = [];
        this.chatActual = null;
        this.mensajes = [];
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        
        await this.#cargarChats();
        this.#render(shadow);
        this.#attachEventListeners(shadow);
    }

    async #cargarChats() {
        try {
            this.chats = await ChatService.obtenerChats();
        } catch (error) {
            console.error('Error al cargar chats:', error);
            this.chats = [
                {
                    id: 1,
                    nombre: "Gilberto Borrego Soto",
                    servicio: "Teclado Gamer Mecánico Ocelot",
                    ultimoMensaje: "Hola Ernestina! Me interes...",
                    avatar: "https://i.pravatar.cc/150?img=15",
                    productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
                    noLeido: true
                },
                {
                    id: 2,
                    nombre: "Ana",
                    servicio: "Sartén de cocina",
                    ultimoMensaje: "Holaaaa!",
                    avatar: "https://i.pravatar.cc/150?img=25",
                    productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
                    noLeido: true
                },
                {
                    id: 3,
                    nombre: "Luis",
                    servicio: "Sartén de cocina",
                    ultimoMensaje: "Te voy a reportar porque l...",
                    avatar: "https://i.pravatar.cc/150?img=33",
                    productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
                    noLeido: false
                },
                {
                    id: 4,
                    nombre: "Diego",
                    servicio: "Teclado Gamer",
                    ultimoMensaje: "Hola buenas tardes, me gu...",
                    avatar: "https://i.pravatar.cc/150?img=14",
                    productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
                    noLeido: true
                },
                {
                    id: 5,
                    nombre: "Richi",
                    servicio: "Sartén de cocina",
                    ultimoMensaje: "Aún tiene disponible el sar...",
                    avatar: "https://i.pravatar.cc/150?img=52",
                    productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
                    noLeido: true
                },
                {
                    id: 6,
                    nombre: "Abel",
                    servicio: "Teclado Gamer",
                    ultimoMensaje: "Hola uwu, e-eto.. aún tiene...",
                    avatar: "https://i.pravatar.cc/150?img=68",
                    productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
                    noLeido: true
                },
                {
                    id: 7,
                    nombre: "Vicky",
                    servicio: "Teclado Gamer",
                    ultimoMensaje: "Hola jeje, ya vendió el tecl...",
                    avatar: "https://i.pravatar.cc/150?img=45",
                    productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
                    noLeido: true
                }
            ];
        }
    }

    async #cargarMensajes(chatId) {
        try {
            this.mensajes = await ChatService.obtenerMensajes(chatId);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            if (chatId === 1) {
                this.mensajes = [
                    {
                        id: 1,
                        texto: "Hola Ernestina! Me interesa el teclado gamer",
                        hora: "12:09 PM",
                        enviado: false
                    },
                    {
                        id: 2,
                        texto: "Hola! Sigue disponible, te gustaría ver algunas fotografías?",
                        hora: "12:11 PM",
                        enviado: true
                    },
                    {
                        id: 3,
                        texto: "Sii por favor si no es mucha molestia",
                        hora: "12:22 PM",
                        enviado: false
                    },
                    {
                        id: 4,
                        imagenes: [
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&h=300&fit=crop"
                        ],
                        hora: "12:25 PM",
                        enviado: true
                    }
                ];
            } else {
                this.mensajes = [];
            }
        }
    }

    #render(shadow) {
        shadow.innerHTML += `
            <div class="chats-container">
                <!-- Lista de chats -->
                <div class="chats-lista">
                    <div class="chats-header">
                        <h2>Chats</h2>
                    </div>
                    <div class="chats-items" id="chatsItems">
                        ${this.#renderChatsLista()}
                    </div>
                </div>

                <!-- Área de conversación -->
                <div class="chat-conversacion" id="chatConversacion">
                    ${this.chatActual ? this.#renderConversacion() : this.#renderVacio()}
                </div>
            </div>
        `;
    }

    #renderChatsLista() {
        return this.chats.map(chat => `
            <div class="chat-item ${chat.id === this.chatActual?.id ? 'active' : ''}" data-chat-id="${chat.id}">
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
                    📎
                </button>
                <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                <textarea 
                    class="mensaje-input" 
                    id="mensajeInput" 
                    placeholder="Escribe aquí..."
                    rows="1"
                ></textarea>
                <button class="btn-enviar" id="btnEnviar">
                    ➤
                </button>
            </div>
        `;
    }

    #renderMensajes() {
        return this.mensajes.map(mensaje => `
            <div class="mensaje ${mensaje.enviado ? 'enviado' : 'recibido'}">
                <div class="mensaje-bubble">
                    ${mensaje.texto || ''}
                    ${mensaje.imagenes ? `
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
                this.#actualizarConversacion(shadow);
            });
        });
    }

    async #actualizarConversacion(shadow) {
        const conversacionContainer = shadow.getElementById('chatConversacion');
        conversacionContainer.innerHTML = this.#renderConversacion();
        
        this.#attachConversacionListeners(shadow);
        
        const mensajesContainer = shadow.getElementById('mensajesContainer');
        if (mensajesContainer) {
            mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
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
                // manejar subida de archivos
                console.log('Archivos seleccionados:', e.target.files);
            });
        }
    }

    async #enviarMensaje(shadow) {
        const mensajeInput = shadow.getElementById('mensajeInput');
        const texto = mensajeInput.value.trim();
        
        if (!texto) return;

        const nuevoMensaje = {
            id: this.mensajes.length + 1,
            texto: texto,
            hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            enviado: true
        };

        try {
            await ChatService.enviarMensaje(this.chatActual.id, texto);
            this.mensajes.push(nuevoMensaje);
            mensajeInput.value = '';
            this.#actualizarConversacion(shadow);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/chats/chats.component.css");
        shadow.appendChild(link);
    }
}