import { PublicacionService } from "../../services/publicacion.service.js";

export class DetallePublicacionComponent extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./detallepublicacion.component.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const id = this.getAttribute('id');
    
        const publicacion = await PublicacionService.obtenerPublicacionesPorId(id);

        this.#agregaEstilo(shadow);
        
        if (publicacion) {
            this.#render(shadow, publicacion);
        } else {
            shadow.innerHTML = "<h2>publicacion no encontrada.</h2>";
        }
        this.#agregarEventListeners(shadow);
    }

    #render(shadow, publicacion) {
        shadow.innerHTML += `
            <div class="container">
                <div class="publicacion-container">
                    <h2 id="titulo">${publicacion.titulo}</h2>
                    <div class="disponibilidad-fecha">
                        <h3 id="disponibilidad">${publicacion.estado}</h3>
                        <h4 id="fechaPublicacion">${publicacion.fechaPublicacion.getDate() + '-' + (publicacion.fechaPublicacion.getMonth() + 1) + '-' + publicacion.fechaPublicacion.getFullYear()}</h4>
                    </div>
                    <img src="${publicacion.imagen}" alt="">
                    <div class="descripcion-info">
                        <h3>Descripción</h3>
                        <h3 id="precio">${publicacion.precio}</h3>
                    </div>
                    <p id="descripcion">
                        ${publicacion.descripcion}
                    </p>
                </div>
                <div class="mensaje-container">
                    <div class="perfil-info">
                        <img class="profile-pic" src="${publicacion.usuario.fotoPerfil}" alt="">
                        <div class="user-data">
                            <h3 id="nombre-perfil">${publicacion.usuario.nombres}</h3>
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
		`;
    }

    #agregarEventListeners(shadow) {
        const btnEnviarMensaje = shadow.getElementById('btn-enviar-mensaje');

        btnEnviarMensaje.addEventListener('click', (e) => {
            e.preventDefault();
            page("/chats");
        });
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}