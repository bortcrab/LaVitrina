import { PublicacionService } from "../../services/publicacion.service.js";
import { ChatService } from "../../services/chat.service.js";
import { SubastasService } from "../../services/subastas.service.js";

export class DetallePublicacionPage extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./detallepublicacion.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const id = this.getAttribute('id');

        const publicacion = await PublicacionService.obtenerPublicacion(id);
        const datosFecha = publicacion.fechaPublicacion.split('-');
        publicacion.fechaPublicacion = datosFecha[0] + '/' + datosFecha[1] + '/' + datosFecha[2];
        console.log(publicacion);

        this.#agregaEstilo(shadow);

        if (publicacion) {
            this.#render(shadow, publicacion);
        } else {
            shadow.innerHTML = "<h2>publicacion no encontrada.</h2>";
        }

        SubastasService.initSocket();
        SubastasService.unirseSubasta(id);
        this.#inicializar(shadow);
        this.#agregarEventListeners(shadow, publicacion.usuario.id);
    }

    async #inicializar(shadow) {
        const subastaComponent = shadow.getElementById('subastaInfo');
        try {
            SubastasService.escucharNuevasPujas((nuevaPuja) => {
                this.#manejarNuevaPuja(shadow, nuevaPuja);
            });

        } catch (error) {
            console.error(error);
            if (subastaComponent && subastaComponent.mostrarError) {
                subastaComponent.mostrarError("Error de conexión", "No pudimos cargar las pujas. Verifica tu internet.");
            }
        }
    }

    #render(shadow, publicacion) {
        shadow.innerHTML += `
            <div class="modal-overlay" id="modalError" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <error-message-info 
                    id="componenteError"
                    titulo="Atención" 
                    mensaje="" 
                    accion="Entendido">
                </error-message-info>
            </div>

            <div class="container">
                <div class="izquierda">
                    <div class="publicacion-container">
                        <h2 id="titulo">${publicacion.titulo}</h2>
                        <div class="disponibilidad-fecha">
                            <h3 id="disponibilidad">${publicacion.estado}</h3>
                            <h4 id="fechaPublicacion">${publicacion.fechaPublicacion}</h4>
                        </div>
                        <img src="${publicacion.imagen}" alt="">
                        <div class="descripcion-info">
                            <h3>Descripción</h3>
                            <h3 id="precio">$ ${publicacion.precio}.00</h3>
                        </div>
                        <p id="descripcion">
                            ${publicacion.descripcion}
                        </p>
                    </div>
                </div>
                <div class="derecha">
                    ${publicacion.tipo === 'Subasta' ? `<subasta-card-info id="subastaInfo" 
                        fechaInicio="${publicacion.subastaData.fechaInicio}"
                        fechaFin="${publicacion.subastaData.fechaFin}"
                        precio="${publicacion.precio}"
                        pujaMayor="${publicacion.subastaData.pujaMayor}"
                        cantidadPujas="${publicacion.subastaData.cantidadPujas}"></subasta-card-info>` : ''}
                    <div class="mensaje-container">
                        <div class="perfil-info">
                            <img class="profile-pic" src="${publicacion.usuario.fotoPerfil}" alt="">
                            <div class="user-data">
                                <a id="link-perfil" href="#"><h3 id="nombre-perfil">${publicacion.usuario.nombres}</h3></a>
                                <div class="resenias">
                                    <h5 id="calificacion"><span class="estrella">★</span>${publicacion.usuario.puntuacion} (1,204 reseñas)</h5>
                                </div>
                            </div>
                        </div>
                        <hr class="line">
                        <div class="button">
                            <button id="btn-enviar-mensaje">Enviar mensaje</button>
                        </div>
                    </div>
                </div>
            </div>
		`;
    }

    #mostrarError(shadow, titulo, mensaje) {
        const modal = shadow.getElementById('modalError');
        const componenteError = shadow.getElementById('componenteError');

        if (componenteError) {
            componenteError.setAttribute('titulo', titulo);
            componenteError.setAttribute('mensaje', mensaje);
        }
        if (modal) modal.style.display = 'flex';

        const cerrar = () => {
            modal.style.display = 'none';
            componenteError.removeEventListener('retry-click', cerrar);
        };
        componenteError.addEventListener('retry-click', cerrar);
    }

    #agregarEventListeners(shadow, idUsuario) {
        const btnEnviarMensaje = shadow.getElementById('btn-enviar-mensaje');
        const idPublicacion = this.getAttribute('id');
        const linkPerfil = shadow.getElementById('link-perfil');

        if (btnEnviarMensaje) {
            btnEnviarMensaje.addEventListener('click', async (e) => {
                e.preventDefault();

                btnEnviarMensaje.disabled = true;
                btnEnviarMensaje.textContent = "Iniciando chat...";

                try {
                    const chat = await ChatService.crearChat(idPublicacion);
                    localStorage.setItem('chatAbiertoId', chat.id);

                    page("/chats");
                } catch (error) {
                    console.error(error);
                    this.#mostrarError(shadow, "No se pudo iniciar el chat", error.message);
                    btnEnviarMensaje.disabled = false;
                    btnEnviarMensaje.textContent = "Enviar mensaje";
                }
            });
        }

        if (linkPerfil) {
            linkPerfil.addEventListener('click', async (e) => {
                if (window.page) page(`/resenias/${idUsuario}`);
            });
        }
        const subastaComponent = shadow.getElementById('subastaInfo');

        const btnRealizarPuja = subastaComponent.shadowRoot.getElementById('btn-realizar-puja');

        btnRealizarPuja.addEventListener('click', async (e) => {
            e.preventDefault();

            btnRealizarPuja.disabled = true;
            btnRealizarPuja.textContent = 'Realizando puja...';

            try {
                const usuarioStorage = localStorage.getItem('usuario');
                const usuario = JSON.parse(usuarioStorage);

                const pujaField = subastaComponent.shadowRoot.getElementById('puja');
                const monto = parseInt(pujaField.value);
                const fechaPuja = new Date();

                const pujaData = {
                    monto,
                    fechaPuja,
                    idUsuario: usuario.id
                }

                console.log(pujaData)

                await SubastasService.realizarPuja(idPublicacion, pujaData);
            } catch (error) {
                console.error(error);
                this.#mostrarError(shadow, "No se pudo realizar la puja", error.message);
                btnRealizarPuja.disabled = false;
                btnRealizarPuja.textContent = "Realizar";
            }
        });
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }

    #manejarNuevaPuja(shadow, nuevaPuja) {
        const subastaComponent = shadow.getElementById('subastaInfo');
        subastaComponent.actualizarOferta(nuevaPuja);
    }
}