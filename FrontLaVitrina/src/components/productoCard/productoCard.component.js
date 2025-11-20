
import { Product } from "../../models/product.js";
export class ProductComponent extends HTMLElement {
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

        const product = new Product(id, titulo, descripcion, precio, imagen, tipo);
        
        this.#agregarEstilos(shadow);
        this.#render(shadow, product);
    }

    #render(shadow, product) {
        shadow.innerHTML += `
        <div class="card-container">
            <div class="card-image">
                <img src="${product.imagen}" alt="Imagen no disponible" >
            </div>

            <div class="card-details">
                <h4>${product.titulo}</h4>
                <div class="card-footer">
                    <span class="price">${product.precio}</span>
                    <span class="tag ${product.tipo.toLowerCase()}">${product.tipo}</span>
                </div>
            </div>
        </div>
        `
        const card = shadow.querySelector('.card-container');
        card.addEventListener('click', () => this.#handleCardClick(product));
    };

    
    #handleCardClick(product) {
        // Emitir evento personalizado cuando se hace click en el producto
        const productClickEvent = new CustomEvent('productClick', {
            bubbles: true,
            composed: true,
            detail: { product }
        });
        this.dispatchEvent(productClickEvent);
        
        // Aquí puedes navegar a una página de detalle si la tienes
        // page(`/producto/${product.id}`);
    }
    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/productoCard/productoCard.component.css");
        shadow.appendChild(link);
    }
}