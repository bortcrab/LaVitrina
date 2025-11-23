
import { Publicacion } from "../../models/publicacion.js";
export class PublicacionComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        const id = this.getAttribute('id');
        const titulo = this.getAttribute('titulo');
        const descripcion = this.getAttribute('descripcion');
        const precio = this.getAttribute('precio');
        const imagen = this.getAttribute('imagen');
        const tipo = this.getAttribute('tipo');

        const publicacion = new Publicacion(id, titulo, descripcion, precio, imagen, tipo);
        
        this.#agregarEstilos(shadow);
        this.#render(shadow, publicacion);
    }

    #render(shadow, publicacion) {
        shadow.innerHTML += `
        <div class="card-container">
            <div class="card-image">
                <img src="${publicacion.imagen}" alt="Imagen no disponible" >
            </div>

            <div class="card-details">
                <h4>${publicacion.titulo}</h4>
                <div class="card-footer">
                    <span class="price">${publicacion.precio}</span>
                </div>
            </div>
        </div>
        `
        const card = shadow.querySelector('.card-container');
        card.addEventListener('click', () => this.#handleCardClick(publicacion));
    };

    
    #handleCardClick(publicacion) {
        const publicacionClickEvent = new CustomEvent('publicacionClick', {
            bubbles: true,
            composed: true,
            detail: { publicacion }
        });
        this.dispatchEvent(publicacionClickEvent);
        
    }
    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/publicacionCard/publicacionCard.component.css");
        shadow.appendChild(link);
    }
}