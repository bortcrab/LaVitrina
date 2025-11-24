import { Publicacion } from "../../models/publicacion.js";

export class DetallePublicacionComponent extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./detallepublicacion.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const titulo = this.getAttribute('titulo');
        const precio = this.getAttribute('precio');
        const estado = this.getAttribute('estado');
        const imagenes = this.getAttribute('imagenes');
        const usuario = this.getAttribute('usuario');
        const fechaPublicacion = this.getAttribute('fechaPublicacion');
        const descripcion = this.getAttribute('descripcion');

        const publicacion = new Publicacion(titulo, descripcion, precio, imagenes, estado, usuario, fechaPublicacion);


        this.#agregaEstilo(shadow);
        this.#render(shadow, publicacion);
    }

    #render(shadow, publicacion) {
        shadow.innerHTML += `
            <div class="container">
                <div class="publicacion-container">
                    <h2 id="titulo">${publicacion.titulo}</h2>
                    <div class="disponibilidad-fecha">
                        <h3 id="disponibilidad">${publicacion.estado}</h3>
                        <h4 id="fechaPublicacion">${publicacion.fechaPublicacion}</h4>
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
                        <img class="profile-pic" src="FrontLaVitrina/src/assets/pedrito.png" alt="">
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

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}