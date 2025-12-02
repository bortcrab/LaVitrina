import { PublicacionService } from '../../services/publicacion.service.js';

export class MisPublicacionesPage extends HTMLElement {
    constructor() {
        super();
        this.misPublicaciones = [];
        this.filteredProducts = [];
        this.categorias = [];
        this.activeCategory = 'Todo';
        this.accionPendiente = null; 
        this.datosPendientes = null;
        this.cssUrl = new URL('./misPublicaciones.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadow = shadow;
        this.#agregarEstilos(shadow);

        this.#renderBase(shadow);

        await Promise.all([
            this.#cargarCategorias(shadow),
            this.#cargarPublicaciones(shadow)
        ]);

        this.#setupEventListeners(shadow);
    }

    async #cargarCategorias(shadow) {
        try {
            this.categorias = await PublicacionService.obtenerCategorias();
            this.#renderCategorias(shadow);
        } catch (error) {
            console.error("Error cargando categorías:", error);an
        }
    }

    async #cargarPublicaciones(shadow) {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            if (!usuarioStorage) {
                throw new Error("No has iniciado sesión.");
            }
            const usuario = JSON.parse(usuarioStorage);

            this.misPublicaciones = await PublicacionService.getPublicacionesPorUsuario(usuario.id);
            
            this.misPublicaciones.sort((a, b) => {
                if (a.estado === 'Vendido' && b.estado !== 'Vendido') return 1;
                if (a.estado !== 'Vendido' && b.estado === 'Vendido') return -1;
                return 0;
            });

            this.filteredProducts = [...this.misPublicaciones];
            this.#actualizarGrid(shadow);

        } catch (error) {
            console.error("Error cargando mis publicaciones:", error);
            
            this.#mostrarModalError(
                "Error de Carga", 
                "No pudimos obtener tus publicaciones. Por favor, verifica tu conexión e inténtalo de nuevo.",
                () => location.reload()
            );
            
            const grid = shadow.getElementById('productsGrid');
            if (grid) grid.innerHTML = '<div class="no-results">No se pudo cargar la información.</div>';
        }
    }

    #renderBase(shadow) {
        shadow.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    visibility: hidden;
                    z-index: -1; 
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .modal-overlay.visible {
                    opacity: 1;
                    visibility: visible;
                    z-index: 1000;
                }
            </style>

            <div class="modal-overlay" id="modalError">
                <error-message-info 
                    id="componenteError"
                    titulo="Atención" 
                    mensaje="Ha habido un problema, inténtalo nuevamente" 
                    accion="Cerrar">
                </error-message-info>
            </div>

            <div class="modal-overlay" id="modalConfirm">
                <confirmation-message-info 
                    id="componenteConfirm"
                    titulo="¿Estás seguro de continuar?" 
                    mensaje="" 
                    accion-aceptar="Sí, continuar"
                    accion-cancelar="Cancelar">
                </confirmation-message-info>
            </div>

            <section class="home-section">
                <div class="section-header">
                    <h2>Mis Publicaciones</h2>
                </div>

                <div class="categories-container" id="categoriesContainer">
                    <button class="filter-pill active" data-category="Todo">Todo</button>
                    </div>

                <div class="products-grid" id="productsGrid">
                    <div style="width: 100%; text-align: center; padding: 2rem;">Cargando...</div>
                </div>
            </section>
        `;
        this.#agregarEstilos(shadow);
    }

    #renderCategorias(shadow) {
        const container = shadow.getElementById('categoriesContainer');
        if(!container) return;
        
        const botonesHtml = this.categorias.map(cat => `
            <button class="filter-pill" data-category="${cat.nombre}">
                ${cat.nombre}
            </button>
        `).join('');
        container.insertAdjacentHTML('beforeend', botonesHtml);
    }

    #generarHtmlProductos(products) {
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

    #actualizarGrid(shadow) {
        const grid = shadow.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = this.#generarHtmlProductos(this.filteredProducts);
        }
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
            if (btn.dataset.category === categoriaNombre) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.#actualizarGrid(shadow);
    }

    async #handleAction(action, publicacion) {
        this.datosPendientes = publicacion;
        this.accionPendiente = action;

        if (action === 'editar') {
            page(`/editar-publicacion/${publicacion.id}`);
            return;
        }

        if (action === 'marcar') {
            const nuevoEstado = publicacion.vendido ? 'Disponible' : 'Vendido';
            this.#mostrarModalConfirmacion(
                "Actualizar Estado",
                `¿Deseas marcar esta publicación como "${nuevoEstado}"?`,
                "Sí, actualizar"
            );
        }

        if (action === 'eliminar') {
            this.#mostrarModalConfirmacion(
                "Eliminar Publicación",
                "¿Estás seguro de que quieres eliminar la publicación permanentemente? Esta acción no se puede deshacer.",
                "Sí, eliminar"
            );
        }
    }

    async #ejecutarAccionConfirmada() {
        this.#ocultarModales();
        const publicacion = this.datosPendientes;

        try {
            if (this.accionPendiente === 'marcar') {
                const nuevoEstado = publicacion.vendido ? 'Disponible' : 'Vendido';
                await PublicacionService.cambiarEstadoVenta(publicacion.id, nuevoEstado);
            } 
            else if (this.accionPendiente === 'eliminar') {
                await PublicacionService.eliminarPublicacion(publicacion.id);
            }

            await this.#cargarPublicaciones(this.shadow);
            
            this.#filterBy(this.activeCategory, this.shadow);

        } catch (error) {
            console.error(error);
            this.#mostrarModalError(
                "Hubo un problema", "No pudimos completar la acción. Inténtalo más tarde."
            );
        } finally {
            this.accionPendiente = null;
            this.datosPendientes = null;
        }
    }

    #mostrarModalConfirmacion(titulo, mensaje, textoBoton) {
        const modal = this.shadow.getElementById('modalConfirm');
        const componente = this.shadow.getElementById('componenteConfirm');
        
        if (componente) {
            componente.setAttribute('titulo', titulo);
            componente.setAttribute('mensaje', mensaje);
            componente.setAttribute('accion-aceptar', textoBoton);
        }
        
        modal.classList.add('visible');
    }

    #mostrarModalError(titulo, mensaje, accionCallback = null) {
        const modal = this.shadow.getElementById('modalError');
        const componente = this.shadow.getElementById('componenteError');
        
        if (componente) {
            componente.setAttribute('titulo', titulo);
            componente.setAttribute('mensaje', mensaje);
            
            const nuevoComponente = componente.cloneNode(true);
            componente.parentNode.replaceChild(nuevoComponente, componente);
            
            nuevoComponente.addEventListener('retry-click', () => {
                if (accionCallback) accionCallback();
                this.#ocultarModales();
            });
        }
        
        modal.classList.add('visible');
    }

    #ocultarModales() {
        const modales = this.shadow.querySelectorAll('.modal-overlay');
        modales.forEach(m => m.classList.remove('visible'));
    }

    #setupEventListeners(shadow) {
        const categoriesContainer = shadow.getElementById('categoriesContainer');
        const productsGrid = shadow.getElementById('productsGrid');
        
        const componenteConfirm = shadow.getElementById('componenteConfirm');
        if (componenteConfirm) {
            componenteConfirm.addEventListener('cancel-click', () => this.#ocultarModales());
            componenteConfirm.addEventListener('confirm-click', () => this.#ejecutarAccionConfirmada());
        }

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

    #agregarEstilos(shadow) {
        if (!shadow.querySelector('link')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}