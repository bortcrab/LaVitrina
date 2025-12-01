export class ChatsComponent extends HTMLElement {
    #chats = [];
    #chatActual = null;
    #mensajes = [];
    #imagenSeleccionada = null;

    constructor() {
        super();
        this.adjuntarIconUrl = new URL('../../assets/adjuntarImagen.png', import.meta.url).href;
        this.enviarIconUrl = new URL('../../assets/enviarMensaje.png', import.meta.url).href;
        this.cssUrl = new URL('./chats.component.css', import.meta.url).href;
    }

    set chats(data) {
        this.#chats = data;
        this.#actualizarListaVisual();
    }

    setChatActivo(chatInfo, mensajes) {
        this.#chatActual = chatInfo;
        this.#mensajes = mensajes;
        const chatEnLista = this.#chats.find(c => c.id === chatInfo.id);
        if(chatEnLista) chatEnLista.noLeido = false;
        
        this.render();
    }

    agregarMensaje(mensaje) {
        if (this.#mensajes.some(m => m.id === mensaje.id)) {
            return;
        }

        this.#mensajes.push(mensaje);
        const shadow = this.shadowRoot;
        const container = shadow.getElementById('mensajesContainer');
        
        if (container) {
            const divMensaje = document.createElement('div');
            divMensaje.className = `mensaje ${mensaje.enviado ? 'enviado' : 'recibido'}`;
            
            let contenidoBubble = '';
            if (mensaje.texto) {
                contenidoBubble += `<div class="mensaje-texto">${mensaje.texto}</div>`;
            }
            if (mensaje.imagenes && mensaje.imagenes.length > 0) {
                contenidoBubble += `<div class="mensaje-imagenes"><img src="${mensaje.imagenes[0]}" class="mensaje-imagen"></div>`;
            }

            divMensaje.innerHTML = `
                <div class="mensaje-bubble">${contenidoBubble}</div>
                <div class="mensaje-hora">${mensaje.hora}</div>
            `;
            container.appendChild(divMensaje);
            
            this.#scrollToBottom();

            const imagenes = divMensaje.querySelectorAll('img');
            imagenes.forEach(img => {
                img.onload = () => this.#scrollToBottom();
            });
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.render();
    }

    #actualizarListaVisual() {
        const shadow = this.shadowRoot;
        if (!shadow) return;
        const listaContainer = shadow.getElementById('chatsItems');
        if (listaContainer) {
            listaContainer.innerHTML = this.#renderChatsLista();
            this.#attachItemListeners(shadow);
        } else {
            this.render();
        }
    }

    mostrarError(titulo, mensaje) {
        const modal = this.shadowRoot.getElementById('modalError');
        const componenteError = this.shadowRoot.getElementById('componenteError');
        
        if (componenteError) {
            componenteError.setAttribute('titulo', titulo);
            componenteError.setAttribute('mensaje', mensaje);
        }
        
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10);
        }

        const cerrar = () => {
            modal.classList.remove('visible');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            componenteError.removeEventListener('retry-click', cerrar);
        };

        componenteError.addEventListener('retry-click', cerrar);
    }

    render() {
        const shadow = this.shadowRoot;
        shadow.innerHTML = `
            <div class="modal-overlay" id="modalError" style="display: none;">
                <error-message-info 
                    id="componenteError"
                    titulo="Atención" 
                    mensaje="" 
                    accion="Entendido">
                </error-message-info>
            </div>

            <div class="chats-container">
                <div class="chats-lista">
                    <div class="chats-header"><h2>Chats</h2></div>
                    <div class="chats-items" id="chatsItems">${this.#renderChatsLista()}</div>
                </div>
                <div class="chat-conversacion" id="chatConversacion">
                    ${this.#chatActual ? this.#renderConversacion() : this.#renderVacio()}
                </div>
            </div>
        `;
        this.#agregarEstilos(shadow);
        this.#attachEventListeners(shadow);
        this.#attachItemListeners(shadow);
        
        if(this.#chatActual) {
            this.#scrollToBottom();
            
            const imagenesHistorial = shadow.querySelectorAll('#mensajesContainer img');
            if (imagenesHistorial.length > 0) {
                imagenesHistorial.forEach(img => {
                    if (img.complete) {
                        this.#scrollToBottom();
                    } else {
                        img.addEventListener('load', () => this.#scrollToBottom());
                    }
                });
            }
        }
    }

    #renderChatsLista() {
        if (!this.#chats.length) return '<div class="chat-vacio"><p>No tienes chats.</p></div>';
        return this.#chats.map(chat => `
            <div class="chat-item ${this.#chatActual && chat.id === this.#chatActual.id ? 'active' : ''}" data-id="${chat.id}">
                <img src="${chat.fotoPerfil}" alt="Avatar" class="chat-avatar">
                <div class="chat-info">
                    <div class="chat-nombre-linea">
                        <span class="chat-nombre">${chat.nombre}</span>
                        ${chat.noLeido ? '<span class="chat-badge"></span>' : ''}
                    </div>
                    <div class="chat-servicio">${chat.tituloPublicacion || 'Artículo'}</div>
                    <div class="chat-ultimo-mensaje">${chat.ultimoMensaje}</div>
                </div>
            </div>
        `).join('');
    }

    #renderConversacion() {
        const existePerfil = this.#chatActual && this.#chatActual.idOtroUsuario;
        const existeProducto = this.#chatActual && this.#chatActual.idPublicacion;

        const estiloPerfil = existePerfil 
            ? 'cursor: pointer; opacity: 1; transition: opacity 0.2s;' 
            : 'cursor: default; opacity: 1;';

        const estiloProducto = existeProducto 
            ? 'cursor: pointer; opacity: 1; transition: opacity 0.2s;' 
            : 'cursor: default; opacity: 0.5; filter: grayscale(100%);';

        return `
            <div class="conversacion-header">
                <img src="${this.#chatActual.fotoPerfil}" 
                     class="conversacion-avatar" 
                     id="btnHeaderPerfil" 
                     style="${estiloPerfil}"
                     title="${existePerfil ? 'Ver perfil de usuario' : 'Usuario no disponible'}">
                     
                <div class="conversacion-info">
                    <h3 class="conversacion-nombre">${this.#chatActual.nombre}</h3>
                    <p class="conversacion-servicio">${this.#chatActual.tituloPublicacion}</p>
                </div>
                
                <img src="${this.#chatActual.productoImg}" 
                     class="conversacion-producto-img" 
                     id="btnHeaderProducto"
                     style="${estiloProducto}"
                     title="${existeProducto ? 'Ver publicación' : 'Publicación no disponible'}">
            </div>
            
            <div class="mensajes-container" id="mensajesContainer">
                ${this.#mensajes.map(m => `
                    <div class="mensaje ${m.enviado ? 'enviado' : 'recibido'}">
                        <div class="mensaje-bubble">
                            ${m.texto ? `<div class="mensaje-texto">${m.texto}</div>` : ''}
                            ${m.imagenes && m.imagenes.length > 0 ? 
                                `<div class="mensaje-imagenes"><img src="${m.imagenes[0]}" class="mensaje-imagen"></div>` : ''}
                        </div>
                        <div class="mensaje-hora">${m.hora}</div>
                    </div>
                `).join('')}
            </div>

            <div class="mensaje-input-container">
                <div id="previewContainer" class="preview-container" style="display: none;">
                    <img id="previewImg" src="" class="preview-img">
                    <button id="btnCancelPreview" class="btn-cancel-preview">✕</button>
                </div>

                <button class="btn-adjunto" id="btnAdjunto" title="Enviar imagen">
                    <img src="${this.adjuntarIconUrl}" alt="Adjuntar">
                </button>
                <input type="file" id="fileInput" accept="image/*" style="display: none;">
                
                <textarea class="mensaje-input" id="mensajeInput" placeholder="Escribe aquí..." rows="1" maxlength="255"></textarea>
                
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
        const btnEnviar = shadow.getElementById('btnEnviar');
        const inputTexto = shadow.getElementById('mensajeInput');
        const btnAdjunto = shadow.getElementById('btnAdjunto');
        const fileInput = shadow.getElementById('fileInput');
        const btnHeaderPerfil = shadow.getElementById('btnHeaderPerfil');
        const btnHeaderProducto = shadow.getElementById('btnHeaderProducto');
        const previewContainer = shadow.getElementById('previewContainer');
        const previewImg = shadow.getElementById('previewImg');
        const btnCancelPreview = shadow.getElementById('btnCancelPreview');

        if (btnHeaderPerfil) {
            btnHeaderPerfil.onclick = () => {
                if (this.#chatActual && this.#chatActual.idOtroUsuario) {
                    page(`/resenias/${this.#chatActual.idOtroUsuario}`);
                } else {
                    this.mostrarError("Usuario no disponible", "Este usuario ya no existe o su perfil no está accesible.");
                }
            };
            
            if(this.#chatActual && this.#chatActual.idOtroUsuario) {
                btnHeaderPerfil.onmouseover = () => btnHeaderPerfil.style.opacity = '0.8';
                btnHeaderPerfil.onmouseout = () => btnHeaderPerfil.style.opacity = '1';
            }
        }

        if (btnHeaderProducto) {
            btnHeaderProducto.onclick = () => {
                if (this.#chatActual && this.#chatActual.idPublicacion) {
                    page(`/detalle-publicacion/${this.#chatActual.idPublicacion}`);
                } else {
                    this.mostrarError("Publicación no disponible", "Esta publicación ya no está disponible.");
                }
            };

            if(this.#chatActual && this.#chatActual.idPublicacion) {
                btnHeaderProducto.onmouseover = () => btnHeaderProducto.style.opacity = '0.8';
                btnHeaderProducto.onmouseout = () => btnHeaderProducto.style.opacity = '1';
            }
        }

        if (fileInput) {
            btnAdjunto.onclick = () => fileInput.click();

            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!file.type.startsWith('image/')) {
                        this.mostrarError("Archivo no válido", "Solo se permiten archivos de imagen (JPG, PNG, etc).");
                        fileInput.value = '';
                        return;
                    }
                    if(file.size > 5 * 1024 * 1024) {
                        this.mostrarError("Imagen muy grande", "La imagen pesa más de 5MB. Por favor intenta con una más ligera.");
                        fileInput.value = '';
                        return;
                    }

                    this.#imagenSeleccionada = file;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        previewImg.src = evt.target.result;
                        previewContainer.style.display = 'flex';
                        inputTexto.disabled = true;
                        inputTexto.placeholder = "Envía la imagen o cancélala";
                        inputTexto.value = ""; 
                    };
                    reader.readAsDataURL(file);
                }
            };
        }

        if (btnCancelPreview) {
            btnCancelPreview.onclick = () => {
                this.#limpiarPreview(shadow);
            };
        }

        const realizarEnvio = () => {
            if (this.#imagenSeleccionada) {
                this.dispatchEvent(new CustomEvent('enviar-imagen', {
                    detail: { chatId: this.#chatActual.id, archivo: this.#imagenSeleccionada },
                    bubbles: true, composed: true
                }));
                this.#limpiarPreview(shadow);
            } 
            else {
                const texto = inputTexto.value.trim();
                if (!texto) return;
                
                this.dispatchEvent(new CustomEvent('enviar-mensaje', {
                    detail: { chatId: this.#chatActual.id, texto },
                    bubbles: true, composed: true
                }));
                
                inputTexto.value = '';

                btnAdjunto.classList.remove('disabled');
                btnAdjunto.disabled = false;
                
                inputTexto.focus();
            }
        };

        if (btnEnviar) {
            btnEnviar.onclick = realizarEnvio;
            
            inputTexto.onkeypress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    realizarEnvio();
                }
            };
            
            inputTexto.oninput = () => {
                const texto = inputTexto.value.trim();
                
                if (texto.length > 0) {
                    btnAdjunto.classList.add('disabled');
                    btnAdjunto.disabled = true;
                } else {
                    btnAdjunto.classList.remove('disabled');
                    btnAdjunto.disabled = false;
                }
            };
        }
    }

    #limpiarPreview(shadow) {
        this.#imagenSeleccionada = null;
        
        const previewContainer = shadow.getElementById('previewContainer');
        const inputTexto = shadow.getElementById('mensajeInput');
        const fileInput = shadow.getElementById('fileInput');
        const btnAdjunto = shadow.getElementById('btnAdjunto');

        if(previewContainer) previewContainer.style.display = 'none';
        if(fileInput) fileInput.value = '';
        
        if(inputTexto) {
            inputTexto.disabled = false;
            inputTexto.placeholder = "Escribe aquí...";
            inputTexto.focus();
        }
        
        if(btnAdjunto) {
            btnAdjunto.classList.remove('disabled');
            btnAdjunto.disabled = false;
        }
    }

    #attachItemListeners(shadow) {
        shadow.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                if (this.#chatActual?.id === id) return;
                this.dispatchEvent(new CustomEvent('chat-seleccionado', {
                    detail: { id }, bubbles: true, composed: true
                }));
            });
        });
    }

    #scrollToBottom() {
        const container = this.shadowRoot.getElementById('mensajesContainer');
        if (!container) return;

        container.scrollTop = container.scrollHeight;

        window.requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
            
            window.requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        });
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