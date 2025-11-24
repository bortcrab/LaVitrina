import { Resenia } from "../../models/resenia.js";

export class ReseniaCardComponent extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./reseniacard.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const id = this.getAttribute('id');
        const titulo = this.getAttribute('titulo');
        const usuario = this.getAttribute('usuario');
        const imgPerfilUsuario = this.getAttribute('imgPerfilUsuario');
        const descripcion = this.getAttribute('descripcion');
        const fechaResenia = new Date(this.getAttribute('fecha'));
        const fecha = (fechaResenia.getDate()) + '-' + (fechaResenia.getMonth() + 1) + '-' + (fechaResenia.getFullYear());
        const calificacion = this.getAttribute('calificacion');

        const resenia = new Resenia(id, titulo, usuario, imgPerfilUsuario, descripcion, calificacion, fecha);

        this.#agregaEstilo(shadow);
        this.#render(shadow, resenia);
    }

    #render(shadow, resenia) {
        shadow.innerHTML += `
        <div class="container">
            <div class="resenia-info">
                <div class="resenia-left-data">
                    <img src="${resenia.imgPerfilUsuario}" alt="">
                    <div class="resenia-data">
                        <h3 id="titulo">${resenia.titulo}</h3>
                        <h5 id="usuario">${resenia.usuario}</h5>
                        <span id="calificacion" class="estrellas">
                            ${resenia.calificacion == 0 ? '☆ ☆ ☆ ☆ ☆'
                                : resenia.calificacion == 1 ? '★ ☆ ☆ ☆ ☆'
                                : resenia.calificacion == 2 ? '★ ★ ☆ ☆ ☆'
                                : resenia.calificacion == 3 ? '★ ★ ★ ☆ ☆'
                                : resenia.calificacion == 4 ? '★ ★ ★ ★ ☆'
                                : resenia.calificacion == 5 ? '★ ★ ★ ★ ★'
                                : '☆ ☆ ☆ ☆ ☆'
                            }
                        </span>
                    </div >
                </div >
            <h5 id="fecha">${resenia.fecha}</h5>
            </div >
        <p id="descripcion">${resenia.descripcion}</p>
        </div >
    `;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}