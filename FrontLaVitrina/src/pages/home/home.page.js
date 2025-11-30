import { PublicacionService } from '../../services/publicacion.service.js';

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.publicaciones = [];
        this.categorias = [];
        this.activeCategory = 'Todo';
        this.cssUrl = new URL('./home.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        document.addEventListener('realizar-busqueda', (e) => {
            this.ejecutarBusqueda(e.detail.termino, shadow);
        });

        try {
            const [publicacionesData, categoriasData] = await Promise.all([
                PublicacionService.getPublicaciones(),
                PublicacionService.obtenerCategorias()
            ]);

            this.publicaciones = publicacionesData;
            this.categorias = categoriasData;

            this.#render(shadow);
            this.#setupEventListeners(shadow);
        } catch (error) {
            console.error("Error cargando home:", error);
            shadow.innerHTML = `<div class="error">Error al cargar datos</div>`;
        }

    }


    #render(shadow) {
        const categoriasHTML = this.categorias.map(cat => `
            <button class="filter-pill ${cat.id == this.activeCategory ? 'active' : ''}" 
                    data-id="${cat.id}" 
                    data-tipo="categoria">
                ${cat.nombre}
            </button>
        `).join('');

        const botonTodo = `
            <button class="filter-pill ${this.activeCategory === 'Todo' ? 'active' : ''}" 
                    data-id="Todo" 
                    data-tipo="todo">
                Todo
            </button>
        `;

        shadow.innerHTML = `
            <section class="home-section">
                <div class="section-header">
                    <h2>Inicio</h2>
                </div>

                <div class="categories-container">
                    ${botonTodo}
                    ${categoriasHTML}
                </div>

                <div class="products-grid" id="productsGrid">
                    ${this.#renderProducts(this.publicaciones)}
                </div>
            </section>
        `;

        this.#agregarEstilos(shadow);
    }

    #renderProducts(publicaciones) {
        if (!publicaciones || publicaciones.length === 0) {
            return `
                <div class="no-results">
                    <p>No se encontraron productos.</p>
                </div>
            `;
        }
        return publicaciones.map(publicacion => `
            <publicacion-info 
                id="${publicacion.id}"
                titulo="${publicacion.titulo}"
                descripcion="${publicacion.descripcion}"
                precio="${publicacion.precio}"
                imagen="${publicacion.imagenes && publicacion.imagenes.length > 0 ? publicacion.imagenes[0] : ''}"
                tipo="${publicacion.tipo || 'venta'}" 
            ></publicacion-info>
        `).join('');
    }

    #setupEventListeners(shadow) {
        const categoriesContainer = shadow.querySelector('.categories-container');
        const productsGrid = shadow.getElementById('productsGrid');
        productsGrid.addEventListener('publicacionClick', (e) => {
            const idPublicacion = e.detail.publicacion.id;
            if (window.page) page(`/detalle-publicacion/${idPublicacion}`);
        });

        categoriesContainer.addEventListener('click', async (e) => {
            const button = e.target.closest('.filter-pill');
            if (button) {
                const tipo = button.dataset.tipo;
                const id = button.dataset.id;

                const buttons = shadow.querySelectorAll('.filter-pill');
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                this.activeCategory = id;

                if (tipo === 'todo') {
                    await this.cargarTodas(shadow);
                } else {
                    await this.filtrarPorCategoria(id, shadow);
                }
            }
        });
    }

    async cargarTodas(shadow) {
        const grid = shadow.getElementById('productsGrid');
        grid.innerHTML = '<div class="loading">Cargando...</div>';
        
        this.publicaciones = await PublicacionService.getPublicaciones();
        grid.innerHTML = this.#renderProducts(this.publicaciones);
    }

    async filtrarPorCategoria(idCategoria, shadow) {
        const grid = shadow.getElementById('productsGrid');
        grid.innerHTML = '<div class="loading">Cargando...</div>';
        
        this.publicaciones = await PublicacionService.obtenerPublicacionesPorCategoria(idCategoria);
        grid.innerHTML = this.#renderProducts(this.publicaciones);
    }
   
    async ejecutarBusqueda(termino, shadow) {
        const grid = shadow.getElementById('productsGrid');
        
        const buttons = shadow.querySelectorAll('.filter-pill');
        buttons.forEach(btn => btn.classList.remove('active'));
        this.activeCategory = null;

        if (!termino || termino.trim() === '') {
            await this.cargarTodas(shadow);
            return;
        }

        grid.innerHTML = '<div class="loading">Buscando...</div>';
        this.publicaciones = await PublicacionService.buscarPublicaciones(termino);
        grid.innerHTML = this.#renderProducts(this.publicaciones);
    }

    #agregarEstilos(shadow) {
        if (!shadow.querySelector('link[href="./src/pages/home/home.page.css"]')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}