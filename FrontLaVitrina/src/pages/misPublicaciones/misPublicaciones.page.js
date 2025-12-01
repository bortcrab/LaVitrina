import { PublicacionService } from '../../services/publicacion.service.js';
import { IniciarSesionService } from '../../services/iniciarSesion.service.js';

export class MisPublicacionesPage extends HTMLElement {
    constructor() {
        super();
        this.misPublicaciones = [];
        this.filteredProducts = [];
        this.uniqueTags = [];
        this.activeTag = 'Todo';
        this.cssUrl = new URL('./misPublicaciones.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadow = shadow;
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        await this.#cargarPublicaciones(); 
        this.#setupEventListeners(shadow);
    }

    async #cargarPublicaciones() {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            if (!usuarioStorage) {
                console.warn("No hay sesión activa");
                return;
            }
            const usuario = JSON.parse(usuarioStorage);

            this.misPublicaciones = await PublicacionService.getPublicacionesPorUsuario(usuario.id);
            
            this.misPublicaciones.sort((a, b) => {
                if (a.estado === 'Vendido' && b.estado !== 'Vendido') return 1;
                if (a.estado !== 'Vendido' && b.estado === 'Vendido') return -1;
                return 0;
            });

            this.filteredProducts = [...this.misPublicaciones]; 
            this.#extractUniqueTags();
            
            if (this.shadow) {
                this.#render(this.shadow);
                this.#setupEventListeners(this.shadow);
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
        const categoriesContainer = shadow.querySelector('.categories-container');
        const productsGrid = shadow.getElementById('productsGrid');

        productsGrid.addEventListener('publicacionClick', (e) => {
            const idPublicacion = e.detail.publicacion.id;
            page(`/detalle-publicacion/${idPublicacion}`);
        });

        productsGrid.addEventListener('publicacionOpcionSeleccionada', (e) => {
            const { action, publicacion } = e.detail;
            this.#handleAction(action, publicacion);
        });

        categoriesContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-pill');

            if (button) {
                const tag = button.dataset.tag;
                this.#filterBy(tag, shadow);
            }
        });
    }

    async #handleAction(action, publicacion) {
        switch (action) {
            case 'editar':
                page(`/editar-publicacion/${publicacion.id}`);
                break;

            case 'marcar':
                const nuevoEstado = publicacion.vendido ? 'Disponible' : 'Vendido';
                const confirmacion = confirm(`¿Cambiar estado a "${nuevoEstado}"?`);

                if (confirmacion) {
                    await PublicacionService.cambiarEstadoVenta(publicacion.id, nuevoEstado);

                    alert(`Publicación marcada como ${nuevoEstado}`);
                    this.#cargarPublicaciones(this.shadow);
                }
                break;

            case 'eliminar':
                if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
                    const eliminada = PublicacionService.eliminarPublicacion(publicacion.id);
                    if (eliminada) {
                        alert('Publicación eliminada correctamente');
                        this.#cargarPublicaciones();
                        this.#render(this.shadow);
                        this.#setupEventListeners(this.shadow);
                    }
                }
                break;
        }
    }

    #filterBy(tag, shadow) {
        this.activeTag = tag;

        if (tag === 'Todo') {
            this.filteredProducts = this.misPublicaciones;
        } else {
            this.filteredProducts = this.misPublicaciones.filter(product =>
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
        if (!shadow.querySelector('link')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}