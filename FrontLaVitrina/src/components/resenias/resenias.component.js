import { Usuario } from "../../models/usuario.js";
import { ReseniasService } from "../../services/resenias.service.js";

export class ReseniasComponent extends HTMLElement {

    constructor() {
        super();
        this.resenias = [];
        this.cssUrl = new URL('./resenias.component.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        await this.#cargarResenias();

        const nombres = this.getAttribute('nombres') || 'Usuario';
        const puntuacion = this.getAttribute('puntuacion') || '0.0';
        const fotoPerfil = this.getAttribute('fotoPerfil') || 'https://i.pravatar.cc/150?img=default';

        const usuario = {
            nombres: nombres,
            fotoPerfil: fotoPerfil,
            puntuacion: puntuacion
        };

        this.#agregaEstilo(shadow);
        this.#render(shadow, usuario);
        this.#agregarEventListeners(shadow);
    }

    async #cargarResenias() {
        try {
            this.resenias = await ReseniasService.getResenias();
        } catch (error) {
            console.error('Error al cargar las resenias:', error);
            this.resenias = [];
        }
    }

    #render(shadow, usuario) {
        shadow.innerHTML += `
            <div class="container">
                <div class="top-info">
                    <div class="user">
                        <img src="${usuario.fotoPerfil}" alt="">
                        <div class="user-info">
                            <h1 id="username">Reseñas de ${usuario.nombres}</h1>
                            <p>Observa lo que dicen los demás de <span id="name">${usuario.nombres}</span></p>
                            <h5 id="calificacion"><span class="estrella">★</span>${usuario.puntuacion}</h5>
                        </div>
                    </div>
                    <button id="btnAgregarResenia" class="btn-escribir-resenia">Escribir reseña<span class="pencil">✎</span></button>
                </div>
                <div class="middle-info">
                    <h2>${this.resenias.length} Reseñas</h2>
                    <div class="filtro-info">
                        <h2>Ordenar por:</h2>
                        <select name="filtro" id="filtro">
                            <option value="reciente">Más reciente</option>
                            <option value="antiguo">Más antiguo</option>
                        </select>
                    </div>
                </div>
                <div id="resenias-cards">
                    ${this.#renderResenias()}
                </div>
            </div>
		`;
    }

    #agregarEventListeners(shadow) {
        const btnAgregarResenia = shadow.getElementById('btnAgregarResenia');

        btnAgregarResenia.addEventListener('click', () => {
            page('/agregar-resenia');
        });
    }

    #renderResenias() {
        if (this.resenias.length === 0) {
            return `
                <div class="no-results">
                    <p>No se encontraron reseñas.</p>
                </div>
            `;
        }

        return this.resenias.map(resenia => `
            <resenia-card-info 
                id="${resenia.id}"
                titulo="${resenia.titulo}"
                usuario="${resenia.usuario}"
                imgPerfilUsuario="${resenia.imgPerfilUsuario}"
                descripcion="${resenia.descripcion}"
                calificacion="${resenia.calificacion}"
                fecha="${resenia.fecha}"
            ></resenia-card-info>
        `).join('');
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}