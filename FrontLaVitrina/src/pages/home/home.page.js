import { PublicacionService } from '../../services/publicacion.service.js';

export class HomePage extends HTMLElement {

    constructor() {
        super();
        this.publicaciones = [];
        this.categorias = [];
        this.activeCategory = 'Todo';
        this.paginaActual = 1;
        this.limitePorPaginaBackend = 20;
        this.hayMasPaginas = true;
        this.isLoading = false;
        this.cssUrl = new URL('./home.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#renderBase(shadow);
        this.#agregarEstilos(shadow);

        this.categorias = await PublicacionService.obtenerCategorias();
        this.#renderCategorias(shadow);
        await this.#cargarPublicaciones(shadow);
        this.#setupEventListeners(shadow);
    }


    async #cargarPublicaciones(shadow) {
        this.isLoading = true;
        this.#mostrarLoading(shadow, true);
        try {
            let respuesta = [];
            if (this.activeCategory === 'Todo') {
                respuesta = await PublicacionService.getPublicaciones(this.paginaActual);
            } else {
                respuesta = await PublicacionService.obtenerPublicacionesPorCategoria(this.activeCategory, this.paginaActual);
            }
            this.publicaciones = respuesta || [];
            this.hayMasPaginas = this.publicaciones.length === this.limitePorPaginaBackend;
            this.#renderProducts(shadow);
            this.#renderPagination(shadow);
        } catch (error) {
            console.error("Error cargando:", error);
            const grid = shadow.getElementById('productsGrid');
            if(grid) grid.innerHTML = `<div class="error-msg">Error al cargar datos.</div>`;
        } finally {
            this.isLoading = false;
            this.#mostrarLoading(shadow, false);
        }
    }


   #renderBase(shadow) {
        shadow.innerHTML = `
            <section class="home-section">
                <div class="section-header">
                    <h2>Inicio</h2>
                </div>
                <div class="categories-container" id="categoriesContainer">
                    <button class="filter-pill active" data-tag="Todo">Todo</button>
                </div>
                <div class="products-grid" id="productsGrid"></div>
                <div class="pagination-container" id="paginationContainer"></div>
            </section>
        `;
    }
    #renderCategorias(shadow) {
        const container = shadow.getElementById('categoriesContainer');
        const htmlCategorias = this.categorias.map(cat => `
            <button class="filter-pill" data-tag="${cat.nombre}" data-id="${cat.id}">
                ${cat.nombre}
            </button>
        `).join('');
        container.insertAdjacentHTML('beforeend', htmlCategorias);
    }

    #renderProducts(shadow) {
        const grid = shadow.getElementById('productsGrid');
        if (this.publicaciones.length === 0) {
            grid.innerHTML = `<div class="no-results"><p>No hay productos en esta página.</p></div>`;
            return;
        }
        grid.innerHTML = this.publicaciones.map(publicacion => {
             const imagenSrc = publicacion.imagenes && publicacion.imagenes.length > 0 
                ? publicacion.imagenes[0] : 'assets/no-image.png';
             return `
                <publicacion-info 
                    id="${publicacion.id}"
                    titulo="${publicacion.titulo}"
                    descripcion="${publicacion.descripcion}"
                    precio="${publicacion.precio}"
                    imagen="${imagenSrc}"
                    tipo="${publicacion.tipo || 'Venta'}" 
                ></publicacion-info>
            `;
        }).join('');
    }
#renderPagination(shadow) {
        const container = shadow.getElementById('paginationContainer');
        
        if (this.paginaActual === 1 && !this.hayMasPaginas) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <button class="page-btn prev" ${this.paginaActual === 1 ? 'disabled' : ''} id="btnPrev">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Anterior
            </button>

            <span class="page-info">Página ${this.paginaActual}</span>

            <button class="page-btn next" ${!this.hayMasPaginas ? 'disabled' : ''} id="btnNext">
                Siguiente 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        `;
        
        const btnPrev = shadow.getElementById('btnPrev');
        const btnNext = shadow.getElementById('btnNext');

        if(btnPrev) btnPrev.addEventListener('click', () => this.#cambiarPagina(shadow, -1));
        if(btnNext) btnNext.addEventListener('click', () => this.#cambiarPagina(shadow, 1));
    }

    #cambiarPagina(shadow, delta) {
        if (this.isLoading) return;
        const nuevaPagina = this.paginaActual + delta;
        if (nuevaPagina < 1) return;
        if (delta > 0 && !this.hayMasPaginas) return;

        this.paginaActual = nuevaPagina;
        shadow.querySelector('.home-section').scrollIntoView({ behavior: 'smooth' });
        this.#cargarPublicaciones(shadow);
    }

    #mostrarLoading(shadow, mostrar) {
        const grid = shadow.getElementById('productsGrid');
        if (!grid) return;
        grid.style.opacity = mostrar ? '0.5' : '1';
        grid.style.pointerEvents = mostrar ? 'none' : 'auto';
    }

    #setupEventListeners(shadow) {
        const productsGrid = shadow.getElementById('productsGrid');
        productsGrid.addEventListener('publicacionClick', (e) => {
            const idPublicacion = e.detail.publicacion.id;
            if(window.page) page(`/detalle-publicacion/${idPublicacion}`);
        });

        const categoriesContainer = shadow.getElementById('categoriesContainer');
        categoriesContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-pill');
            if (button && !this.isLoading) {
                const currentActive = categoriesContainer.querySelector('.active');
                if(currentActive) currentActive.classList.remove('active');
                button.classList.add('active');

                this.activeCategory = button.dataset.id; 
                if(button.dataset.tag === 'Todo') this.activeCategory = 'Todo';

                this.paginaActual = 1; 
                this.#cargarPublicaciones(shadow);
            }
        });
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
        
    }
}