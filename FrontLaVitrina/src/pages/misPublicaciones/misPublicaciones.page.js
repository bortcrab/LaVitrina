import { PublicacionService } from '../../services/publicacion.service.js';
import { IniciarSesionService } from '../../services/iniciarSesion.service.js';

export class MisPublicacionesPage extends HTMLElement {
    constructor() {
        super();
        this.misPublicaciones = [];
        this.filteredProducts = [];
        this.categorias = [];
        this.activeCategory = 'Todo';
        this.cssUrl = new URL('./misPublicaciones.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadow = shadow;
        this.#agregarEstilos(shadow);

        await Promise.all([
            this.#cargarCategorias(),
            this.#cargarPublicaciones()
        ]);

        this.#render(shadow);
        this.#setupEventListeners(shadow);
    }

    async #cargarCategorias() {
        this.categorias = await PublicacionService.obtenerCategorias();
    }

    async #cargarPublicaciones() {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            if (!usuarioStorage) return;
            const usuario = JSON.parse(usuarioStorage);

            this.misPublicaciones = await PublicacionService.getPublicacionesPorUsuario(usuario.id);
            
            this.misPublicaciones.sort((a, b) => {
                if (a.estado === 'Vendido' && b.estado !== 'Vendido') return 1;
                if (a.estado !== 'Vendido' && b.estado === 'Vendido') return -1;
                return 0;
            });

            this.filteredProducts = [...this.misPublicaciones];
            
            if (this.shadow && this.shadow.querySelector('#productsGrid')) {
                this.#renderProducts(this.shadow, this.filteredProducts);
            }
        } catch (error) {
            console.error("Error cargando mis publicaciones:", error);
        }
    }

    #extractUniqueTags() {
        const allTags = this.misPublicaciones.flatMap(product => product.etiquetas);
        this.uniqueTags = ['Todo', ...new Set(allTags)];
    }

    #render(shadow) {
        shadow.innerHTML = `
            <section class="home-section">
                <div class="section-header">
                    <h2>Mis Publicaciones</h2>
                </div>

                <div class="categories-container" id="categoriesContainer">
                    <button class="filter-pill active" data-category="Todo">Todo</button>
                    ${this.categorias.map(cat => `
                        <button class="filter-pill" data-category="${cat.nombre}">
                            ${cat.nombre}
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
        if (!products || products.length === 0) {
            return `
                <div class="no-results">
                    <p>No tienes publicaciones en esta categoría.</p>
                </div>
            `;
        }

        return products.map(product => {
            let imagenUrl = './src/assets/imagendefault.png';
            
            if (product.imagenes && product.imagenes.length > 0) {
                const primeraImg = product.imagenes[0];
                if (typeof primeraImg === 'object' && primeraImg.url) {
                    imagenUrl = primeraImg.url;
                } else if (typeof primeraImg === 'string') {
                    imagenUrl = primeraImg;
                }
            }

            const esVendido = product.estado === 'Vendido';

            return `
            <publicacion-opciones-info 
                id="${product.id}"
                titulo="${product.titulo}"
                descripcion="${product.descripcion}"
                precio="${product.precio}"
                imagen="${imagenUrl}"
                estado="${product.estado}"
                tipo="${product.tipo || 'Venta'}"
                vendido="${esVendido}"
            ></publicacion-opciones-info>
        `}).join('');
    }

    #setupEventListeners(shadow) {
        const categoriesContainer = shadow.getElementById('categoriesContainer');
        const productsGrid = shadow.getElementById('productsGrid');

        productsGrid.addEventListener('publicacionClick', (e) => {
            page(`/detalle-publicacion/${e.detail.publicacion.id}`);
        });

        productsGrid.addEventListener('publicacionOpcionSeleccionada', (e) => {
            this.#handleAction(e.detail.action, e.detail.publicacion);
        });

        categoriesContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-pill');
            if (button) {
                const categoria = button.dataset.category;
                this.#filterBy(categoria, shadow);
            }
        });
    }

    async #handleAction(action, publicacion) {
        try {
            switch (action) {
                case 'editar':
                    page(`/editar-publicacion/${publicacion.id}`);
                    break;
                case 'marcar':
                    const nuevoEstado = publicacion.vendido ? 'Disponible' : 'Vendido';
                    if (confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
                        await PublicacionService.cambiarEstadoVenta(publicacion.id, nuevoEstado);
                        alert(`Publicación marcada como ${nuevoEstado}`);
                        await this.#cargarPublicaciones();
                        this.#render(this.shadow);
                        this.#setupEventListeners(this.shadow);
                    }
                    break;
                case 'eliminar':
                    if (confirm('¿Eliminar esta publicación permanentemente?')) {
                        await PublicacionService.eliminarPublicacion(publicacion.id);
                        alert('Eliminada correctamente');
                        await this.#cargarPublicaciones();
                        this.#render(this.shadow);
                        this.#setupEventListeners(this.shadow);
                    }
                    break;
            }
        } catch(e) { console.error(e); }
    }

    #filterBy(categoriaNombre, shadow) {
        this.activeCategory = categoriaNombre;

        if (categoriaNombre === 'Todo') {
            this.filteredProducts = [...this.misPublicaciones];
        } else {
            this.filteredProducts = this.misPublicaciones.filter(product => 
                product.categoria && product.categoria.nombre === categoriaNombre
            );
        }

        const buttons = shadow.querySelectorAll('.filter-pill');
        buttons.forEach(btn => {
            if (btn.dataset.category === categoriaNombre) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        this.#renderProducts(shadow, this.filteredProducts);
    }

    #agregarEstilos(shadow) {
        if (!shadow.querySelector('link')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}