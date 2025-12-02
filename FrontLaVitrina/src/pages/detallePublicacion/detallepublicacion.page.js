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
        this.imagenes = publicacion.imagenes;
        const datosFecha = publicacion.fechaPublicacion.split('-');
        publicacion.fechaPublicacion = datosFecha[0] + '/' + datosFecha[1] + '/' + datosFecha[2];
        publicacion.precioMostrar = publicacion.precio;

        if (publicacion.tipo === 'Subasta') {
            SubastasService.initSocket();
            SubastasService.unirseSubasta(id);

            (parseInt(publicacion.precio) < parseInt(publicacion.subastaData.pujaMayor)) ? publicacion.precioMostrar = publicacion.subastaData.pujaMayor : publicacion.precioMostrar = publicacion.precio;
        }

        this.#agregaEstilo(shadow);

        if (publicacion) {
            let usuarioStorage = localStorage.getItem('usuario');
            usuarioStorage = JSON.parse(usuarioStorage);
            this.#render(shadow, publicacion, usuarioStorage);
        } else {
            shadow.innerHTML = "<h2>publicacion no encontrada.</h2>";
        }


        this.#inicializar(shadow);
        this.#agregarEventListeners(shadow, publicacion);
        this.#setupCarousel(shadow);
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

    #render(shadow, publicacion, usuarioStorage) {
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
                        <div class="carousel-wrapper">
                            ${this.imagenes.length > 1 ? '<button class="carousel-btn prev" id="btnPrev">❮</button>' : ''}
                            
                            <div class="carousel-track" id="carouselTrack">
                                ${this.#renderImagenes()}
                            </div>
                            
                            ${this.imagenes.length > 1 ? '<button class="carousel-btn next" id="btnNext">❯</button>' : ''}
                            
                            ${this.imagenes.length > 1 ? `<div class="carousel-dots" id="carouselDots">
                                ${this.imagenes.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
                            </div>` : ''}
                        </div>
                        <div class="descripcion-info">
                            <h3>Descripción</h3>
                            <h3 id="precio">${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(publicacion.precioMostrar)}</h3>
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

        const subastaComponent = shadow.getElementById('subastaInfo');
        if (subastaComponent) {
            const pujaCard = subastaComponent.shadowRoot.getElementById('puja-card');

            if (publicacion.usuario.id == usuarioStorage.id) {
                pujaCard.style.display = 'none';
            }
        }
    }

    #renderImagenes() {
        if (this.imagenes.length === 0) {
            return `
                <div class="carousel-slide">
                    <img src="./src/assets/noimage.jpeg" alt="Sin imagen">
                </div>
            `;
        }
        return this.imagenes.map(imgUrl => `
            <div class="carousel-slide">
                <img src="${imgUrl}" alt="Imagen producto">
            </div>
        `).join('');
    }

    #setupCarousel(shadow) {
        if (this.imagenes.length <= 1) return;

        const track = shadow.getElementById('carouselTrack');
        const btnPrev = shadow.getElementById('btnPrev');
        const btnNext = shadow.getElementById('btnNext');
        const dots = shadow.querySelectorAll('.dot');

        if (!track) return;

        const scrollAmount = () => track.clientWidth;

        if(btnNext) {
            btnNext.onclick = () => {
                track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            };
        }

        if(btnPrev) {
            btnPrev.onclick = () => {
                track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            };
        }

        dots.forEach((dot, index) => {
            dot.onclick = () => {
                const width = track.clientWidth;
                track.scrollTo({ left: width * index, behavior: 'smooth' });
            };
        });

        track.addEventListener('scroll', () => {
            const width = track.clientWidth;
            const scrollPos = track.scrollLeft;
            const index = Math.round(scrollPos / width);

            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        });
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

    #agregarEventListeners(shadow, publicacion) {
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
                if (window.page) page(`/resenias/${publicacion.usuario.id}`);
            });
        }

        const subastaComponent = shadow.getElementById('subastaInfo');

        if (subastaComponent) {
            const btnRealizarPuja = subastaComponent.shadowRoot.getElementById('btn-realizar-puja');

            btnRealizarPuja.addEventListener('click', async (e) => {
                const puja = subastaComponent.shadowRoot.getElementById('puja');

                e.preventDefault();

                if (publicacion.subastaData.pujaMayor) {
                    if (parseInt(puja.value) >= (parseInt(publicacion.subastaData.pujaMayor) + 10)) {
                        btnRealizarPuja.disabled = true;
                        btnRealizarPuja.textContent = 'Realizando puja...';

                        try {
                            const usuarioStorage = localStorage.getItem('usuario');
                            const usuario = JSON.parse(usuarioStorage);

                            const monto = parseInt(puja.value);
                            const fechaPuja = new Date();

                            puja.value = '';

                            const pujaData = {
                                monto,
                                fechaPuja,
                                idUsuario: usuario.id
                            }

                            await SubastasService.realizarPuja(idPublicacion, pujaData);
                        } catch (error) {
                            console.error(error);
                            this.#mostrarError(shadow, "No se pudo realizar la puja", error.message);
                            btnRealizarPuja.disabled = false;
                            btnRealizarPuja.textContent = "Realizar";
                        }
                    } else {
                        subastaComponent.mostrarError('Debes cumplir con el monto mínimo.');
                    }
                } else {
                    if (parseInt(puja.value) >= (parseInt(publicacion.precio) + 10)) {
                        btnRealizarPuja.disabled = true;
                        btnRealizarPuja.textContent = 'Realizando puja...';

                        try {
                            const usuarioStorage = localStorage.getItem('usuario');
                            const usuario = JSON.parse(usuarioStorage);

                            const monto = parseInt(puja.value);
                            const fechaPuja = new Date();

                            puja.value = '';

                            const pujaData = {
                                monto,
                                fechaPuja,
                                idUsuario: usuario.id
                            }

                            await SubastasService.realizarPuja(idPublicacion, pujaData);
                        } catch (error) {
                            console.error(error);
                            this.#mostrarError(shadow, "No se pudo realizar la puja", error.message);
                            btnRealizarPuja.disabled = false;
                            btnRealizarPuja.textContent = "Realizar";
                        }
                    } else {
                        subastaComponent.mostrarError('Debes cumplir con el monto mínimo.');
                    }
                }
            });
        }
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }

    #manejarNuevaPuja(shadow, nuevaPuja) {
        const precio = shadow.getElementById('precio');
        const subastaComponent = shadow.getElementById('subastaInfo');

        precio.textContent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(nuevaPuja.pujaMayor);
        subastaComponent.actualizarOferta(nuevaPuja);
    }
}