import { ProductService } from '../../services/publicacion.service.js';

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.allProducts = [];
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.allProducts = ProductService.getProducts();
        
        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

  

    


   #render(shadow) {
        shadow.innerHTML += `
            <section class="home-section">
                <div class="section-header">
                    <h2>Productos Disponibles</h2>
                </div>
                <div class="products-grid">
                    ${this.#renderProducts(this.allProducts)}
                </div>
            </section>
        `;
    }

    #renderProducts(products) {
        if (products.length === 0) {
            return `
                <div class="no-results">
                    <p>No se encontraron productos</p>
                </div>
            `;
        }

        return products.map(product => `
            <product-info 
                id="${product.id}"
                titulo="${product.titulo}"
                descripcion="${product.descripcion}"
                precio="${product.precio}"
                imagen="${product.imagen}"
                tipo="${product.tipo}"
            ></product-info>
        `).join('');
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/pages/home/home.page.css");
        shadow.appendChild(link);
    }
}