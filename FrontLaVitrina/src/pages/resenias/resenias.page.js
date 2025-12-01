import { Usuario } from "../../models/usuario.js";
import { ReseniasService } from "../../services/resenias.service.js";
import { UsuariosService } from "../../services/usuario.service.js";

export class ReseniasPage extends HTMLElement {

    constructor() {
        super();
        this.resenias = [];
        this.cssUrl = new URL('./resenias.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        try {
            let usuarioStorage = localStorage.getItem('usuario');
            usuarioStorage = JSON.parse(usuarioStorage);
            const idUsuario = this.getAttribute('id');

            console.log(idUsuario)
            console.log(usuarioStorage.id)
            console.log(usuarioStorage.id == idUsuario)

            if (!idUsuario) {
                throw new Error('Se debe proporcionar un usuario.');
            }

            const usuario = await UsuariosService.obtenerUsuarioPorId(idUsuario);

            await this.#cargarResenias(usuario.id);

            this.#agregaEstilo(shadow);
            this.#render(shadow, usuario, usuarioStorage);
            this.#agregarEventListeners(shadow, usuario.id);

        } catch (error) {
            console.warn("Error de sesión:", error.message);
            if (window.page) page('/iniciar-sesion');
        }
    }

    async #cargarResenias(idUsuario) {
        try {
            this.resenias = await ReseniasService.getReseniasUsuario(idUsuario);
        } catch (error) {
            console.error('Error al cargar las resenias:', error);
            this.resenias = [];
        }
    }

    #render(shadow, usuario, usuarioStorage) {
        shadow.innerHTML += `
            <div class="container">
                <div class="top-info">
                    <div class="user">
                        <img src="${usuario.fotoPerfil}" alt="">
                        <div class="user-info">
                            ${usuario.idUsuario === usuarioStorage.id ? '<h1 id="username">Tus reseñas</h1>' : `<h1 id="username">Reseñas de ${usuario.nombres}</h1>`}
                            ${usuario.idUsuario === usuarioStorage.id ? '<p>Observa lo que dicen los demás de ti</p>' : `<p>Observa lo que dicen los demás de <span id="name">${usuario.nombres}</span></p>`}
                            <h5 id="calificacion"><span class="estrella">★</span>${usuario.puntuacion}</h5>
                        </div>
                    </div>
                    ${usuario.idUsuario !== usuarioStorage.id ? '<button id="btnAgregarResenia" class="btn-escribir-resenia">Escribir reseña<span class="pencil">✎</span></button>' : ''}
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

    #agregarEventListeners(shadow, id) {
        const btnAgregarResenia = shadow.getElementById('btnAgregarResenia');

        if (btnAgregarResenia) {
            btnAgregarResenia.addEventListener('click', () => {
                page(`/agregar-resenia/${id}`);
            });
        }
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