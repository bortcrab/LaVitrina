import { PublicacionService } from '../../services/publicacion.service.js';

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.allProducts = [];
        this.filteredProducts = [];
        this.uniqueTags = [];
        this.activeTag = 'Todo';
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.allProducts = PublicacionService.getPublicaciones();
        this.filteredProducts = [...this.allProducts];

        this.#extractUniqueTags();

        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#setupEventListeners(shadow);
    }

    #extractUniqueTags() {
        const allTags = this.allProducts.flatMap(product => product.etiquetas);

        this.uniqueTags = ['Todo', ...new Set(allTags)];
    }

    #render(shadow) {
        shadow.innerHTML = `
            <section class="home-section">
                <div class="section-header">
                    <h2>Inicio</h2>
                </div>

                <div class="categories-container">
                    ${this.uniqueTags.map(tag => `
                        <button class="filter-pill ${tag === this.activeTag ? 'active' : ''}" 
                                data-tag="${tag}">
                            ${tag}
                        </button>
                    `).join('')}
                </div>

                <div class="products-grid" id="productsGrid">
                    ${this.#renderProducts(this.filteredProducts)}
                </div>
            </section>
        `;

        this.#agregarEstilos(shadow);
    }

    #renderProducts(products) {
        if (products.length === 0) {
            return `
                <div class="no-results">
                    <p>No hay productos con esta etiqueta.</p>
                </div>
            `;
        }

        return products.map(product => `
            <publicacion-info 
                id="${product.id}"
                titulo="${product.titulo}"
                descripcion="${product.descripcion}"
                precio="${product.precio}"
                imagen="${product.imagen}"
                estado="${product.estado}" 
            ></publicacion-info>
        `).join('');
    }

    #setupEventListeners(shadow) {
        const categoriesContainer = shadow.querySelector('.categories-container');
        const productsGrid = shadow.getElementById('productsGrid');
        productsGrid.addEventListener('publicacionClick', (e) => {
            const idPublicacion = e.detail.publicacion.id;
            page(`/detalle-publicacion/${idPublicacion}`);
        });
        categoriesContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-pill');

            if (button) {
                const tag = button.dataset.tag;
                this.#filterBy(tag, shadow);
            }
        });
    }

    #filterBy(tag, shadow) {
        this.activeTag = tag;

        if (tag === 'Todo') {
            this.filteredProducts = this.allProducts;
        } else {
            this.filteredProducts = this.allProducts.filter(product =>
                product.etiquetas.includes(tag)
            );
        }

        const buttons = shadow.querySelectorAll('.filter-pill');
        buttons.forEach(btn => {
            if (btn.dataset.tag === tag) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const grid = shadow.getElementById('productsGrid');
        grid.innerHTML = this.#renderProducts(this.filteredProducts);
    }

    #agregarEstilos(shadow) {
        if (!shadow.querySelector('link[href="./src/pages/home/home.page.css"]')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", "./src/pages/home/home.page.css");
            shadow.appendChild(link);
        }
    }
}