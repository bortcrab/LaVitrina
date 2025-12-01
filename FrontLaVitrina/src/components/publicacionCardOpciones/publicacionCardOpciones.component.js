import { Publicacion } from "../../models/publicacion.js";

export class PublicacionOpcionesComponent extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./publicacionCardOpciones.component.css', import.meta.url).href;
        this.menuAbierto = false;
        this.editarIcon = new URL('../../assets/editarPublicacionNuevo.png', import.meta.url).href;
        this.eliminarIcon = new URL('../../assets/eliminarPublicacionNuevo.png', import.meta.url).href;
        this.vendidoIcon = new URL('../../assets/marcarVendidoNuevo.png', import.meta.url).href;
        this.disponibleIcon = new URL('../../assets/marcarDisponible.png', import.meta.url).href;
        this.noDisponible = new URL('../../assets/noimage.jpeg', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        const id = this.getAttribute('id');
        const titulo = this.getAttribute('titulo');
        const descripcion = this.getAttribute('descripcion');
        const precio = this.getAttribute('precio');
        const imagen = this.getAttribute('imagen');
        const estado = this.getAttribute('estado');
        const tipo = this.getAttribute('tipo');
        const vendido = this.getAttribute('vendido') === 'true';

        const datosParaLaClase = {
            id, titulo, descripcion, precio,
            imagenes: imagen ? [imagen] : [],
            estado, 
            tipo: tipo || 'Venta'
        };

        const publicacion = new Publicacion(datosParaLaClase);
        publicacion.vendido = vendido;
        
        this.#render(shadow, publicacion);
        this.#agregarEstilos(shadow);
        this.#agregarEventListeners(shadow, publicacion);
        
        document.addEventListener('click', (e) => this.#cerrarMenuExterno(e, shadow));
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.#cerrarMenuExterno);
    }

    #render(shadow, publicacion) {
        const precioFormateado = parseFloat(publicacion.precio).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0
        });

        const imagenSrc = publicacion.imagenes && publicacion.imagenes.length > 0 
            ? publicacion.imagenes[0] 
            : this.noDisponible;

        shadow.innerHTML = `
        <style>
            .menu-opciones {
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
            }
        </style>
        <div class="card-container">
            <div class="menu-container">
                <button class="menu-button" id="menuButton">⋮</button>
                <div class="menu-opciones" id="menuOpciones">
                    
                    <div class="menu-opcion" data-action="editar">
                        <img src="${this.editarIcon}" class="menu-icon" alt="Editar"> 
                        Editar
                    </div>

                    <div class="menu-opcion" data-action="marcar">
                        ${publicacion.vendido 
                            ? `<img src="${this.disponibleIcon}" class="menu-icon" alt="Disponible"> Marcar disponible` 
                            : `<img src="${this.vendidoIcon}" class="menu-icon" alt="Vendido"> Marcar vendido`
                        }
                    </div>

                    <div class="menu-opcion" data-action="eliminar">
                        <img src="${this.eliminarIcon}" class="menu-icon" alt="Eliminar"> 
                        Eliminar
                    </div>

                </div>
            </div>
            
            <div class="card-image">
                <img src="${imagenSrc}" alt="Imagen producto" onerror="this.src='${this.noDisponible}'">
            </div>

            <div class="card-details">
                <h4>${publicacion.titulo}</h4>
                <div class="card-footer">
                    <div class="footer-left">
                        <span class="price">${precioFormateado}</span>
                        
                        ${publicacion.vendido 
                            ? `<span class="estado-venta vendido">Vendido</span>` 
                            : `<span class="estado-venta disponible">Disponible</span>`
                        }
                    </div>

                    <span class="tag">${publicacion.tipo}</span>
                </div>
            </div>
        </div>
        `;
    }

    #agregarEventListeners(shadow, publicacion) {
        const menuButton = shadow.getElementById('menuButton');
        const menuOpciones = shadow.getElementById('menuOpciones');

        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.menuAbierto = !this.menuAbierto;
            menuOpciones.classList.toggle('active', this.menuAbierto);
        });

        const opciones = shadow.querySelectorAll('.menu-opcion');
        opciones.forEach(opcion => {
            opcion.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = opcion.dataset.action;
                this.#handleAction(action, publicacion);
                this.#cerrarMenu(shadow);
            });
        });

        const card = shadow.querySelector('.card-container');
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-container')) {
                this.#handleCardClick(publicacion);
            }
        });
    }

    #handleAction(action, publicacion) {
        const event = new CustomEvent('publicacionOpcionSeleccionada', {
            bubbles: true,
            composed: true,
            detail: { action, publicacion }
        });
        this.dispatchEvent(event);
    }

    #handleCardClick(publicacion) {
        const publicacionClickEvent = new CustomEvent('publicacionClick', {
            bubbles: true,
            composed: true,
            detail: { publicacion }
        });
        this.dispatchEvent(publicacionClickEvent);
    }

    #cerrarMenu(shadow) {
        const menuOpciones = shadow.getElementById('menuOpciones');
        this.menuAbierto = false;
        menuOpciones.classList.remove('active');
    }

    #cerrarMenuExterno(e, shadow) {
        if (!this.contains(e.target)) {
            this.#cerrarMenu(shadow);
        }
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}