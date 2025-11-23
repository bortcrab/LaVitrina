import { ReseniasService } from "../../services/resenias.service.js";

export class ReseniasPage extends HTMLElement {

    constructor() {
        super();
        this.resenias = [];
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.resenias = ReseniasService.getResenias();

        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
            ${this.#renderResenias(this.resenias)}    
        `;
    }

    #renderResenias(resenias) {
        if (resenias.length === 0) {
            return `
                <div class="no-results">
                    <p>No se encontraron reseñas.</p>
                </div>
            `;
        }

        return resenias.map(resenia => `
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

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/pages/resenias/resenias.page.css");
        shadow.appendChild(link);
    }
}