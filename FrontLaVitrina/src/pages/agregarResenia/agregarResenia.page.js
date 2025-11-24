import { ReseniasService } from '../../services/resenias.service.js';
import { UsuariosService } from '../../services/usuario.service.js';

export class AgregarReseniaPage extends HTMLElement {
    constructor() {
        super();
        // Estado para almacenar la calificación seleccionada
        this.calificacionSeleccionada = 0;
        // Nuevo estado para los datos del vendedor
        this.vendedor = null;
        this.usuarioId = null;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.#agregarEstilos(shadow);

        // Obtener el ID del vendedor del atributo
        this.usuarioId = this.getAttribute('id');

        if (!this.usuarioId) {
            console.error("No se proporcionó ID del vendedor");
            return;
        }

        // Cargar datos del vendedor ANTES de renderizar
        await this.#cargarDatos(shadow, this.usuarioId);

        // Ahora renderizar con los datos cargados
        this.#render(shadow);

        this.#agregarEventListeners(shadow);
    }


    /**
     * Carga los datos del vendedor simulado.
     */
    async #cargarDatos(shadow, usuarioId) {
        try {
            // Obtener los datos del vendedor usando el ID recibido
            this.vendedor = await UsuariosService.getVendedor(usuarioId);

            if (!this.vendedor) {
                console.error("Vendedor no encontrado");
                // Valores por defecto en caso de error
                this.vendedor = {
                    nombre: "Vendedor no encontrado",
                    puntaje: 0,
                    totalResenias: 0,
                    imagenUrl: ""
                };
                return;
            }

            console.log("Datos del vendedor cargados:", this.vendedor);
        } catch (error) {
            console.error("Error al cargar datos del vendedor:", error);
            alert("Error al cargar los datos del vendedor");
            this.vendedor = {
                nombre: "Vendedor no encontrado",
                puntaje: 0,
                totalResenias: 0,
                imagenUrl: ""
            };
        }
    }

    /**
     * Genera las estrellas ★ de forma dinámica basado en la calificación.
     * @param {number} puntaje - El puntaje del vendedor (e.g., 4.9).
     * @returns {string} HTML con las estrellas.
     */
    #generarEstrellas(puntaje) {
        const totalEstrellas = 5;
        const estrellasLlenas = Math.round(puntaje);
        let estrellasHTML = '';

        for (let i = 0; i < totalEstrellas; i++) {
            estrellasHTML += (i < estrellasLlenas) ? '★' : '☆'; // Usar ☆ para estrella vacía si quieres más precisión visual
        }
        return `<span class="estrellas">${estrellasHTML}</span>`;
    }

    #render(shadow) {
        // Usar los datos del vendedor si están disponibles, si no, usar valores por defecto
        const nombreVendedor = this.vendedor?.nombre || 'Vendedor';
        const puntajeVendedor = this.vendedor?.puntaje.toFixed(1) || 'N/A';
        const totalResenias = this.vendedor?.totalResenias || 0;
        const imagenUrl = this.vendedor?.imagenUrl || '';
        console.log(imagenUrl);
        const estrellasHTML = this.#generarEstrellas(this.vendedor?.puntaje || 0);

        shadow.innerHTML += `
        <div class="contenedor-main">
            <div class="contenedor">
                <div class="datos-vendedor">
                    <h2>${nombreVendedor}</h2>
                    <img class="imagen-vendedor" src="../${imagenUrl}" alt="Imagen de ${nombreVendedor}">
                    <h4>Puntaje del vendedor</h4>
                    <div class="rating">
                        <span class="rating-numero">${puntajeVendedor}</span>
                        ${estrellasHTML} 
                    </div>
                    <p class="total-reseñas">Basado en ${totalResenias} reseñas</p>
                </div>
            </div>
            <div class="contenedor" id="datos-resenia">
                <div class="datos">
                    <h1>Agregar reseña</h1>
                    <div class="contenedor-rating-usuario">
                        <label>Tu calificación</label>
                        <div class="rating-usuario" id="ratingUsuario">
                            <span class="estrella" data-value="1"></span>
                            <span class="estrella" data-value="2"></span>
                            <span class="estrella" data-value="3"></span>
                            <span class="estrella" data-value="4"></span>
                            <span class="estrella" data-value="5"></span>
                        </div>
                    </div>
                    <div class="contenedor-input">
                        <label for="titulo">Título</label>
                        <input type="text" name="titulo" id="titulo" placeholder='Resume tu experiencia con el vendedor' />
                    </div>
                    <div class="contenedor-input">
                        <label for="descripcion">Reseña</label>
                        <textarea name="descripcion" id="descripcion" placeholder="Reseña detalladamente al vendedor"></textarea>
                    </div>
                    <button type="submit" class="btn-agregar">Agregar</button>
                </div>
            </div>
        </div>
        `;
    };

    #agregarEventListeners(shadow) {
        const estrellas = shadow.querySelectorAll('.rating-usuario .estrella');
        const ratingContainer = shadow.getElementById('ratingUsuario');

        const actualizarEstrellas = (puntuacion) => {
            estrellas.forEach(estrella => {
                const valor = parseInt(estrella.getAttribute('data-value'));
                if (valor <= puntuacion) {
                    estrella.classList.add('llena');
                } else {
                    estrella.classList.remove('llena');
                }
            });
        };

        ratingContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('estrella')) {
                const puntuacionHover = parseInt(e.target.getAttribute('data-value'));
                actualizarEstrellas(puntuacionHover);
            }
        });

        ratingContainer.addEventListener('mouseout', () => {
            actualizarEstrellas(this.calificacionSeleccionada);
        });

        ratingContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('estrella')) {
                this.calificacionSeleccionada = parseInt(e.target.getAttribute('data-value'));
                actualizarEstrellas(this.calificacionSeleccionada);
                console.log(`Calificación seleccionada: ${this.calificacionSeleccionada}`);
                // Aquí puedes mostrar esta calificación en alguna parte o almacenarla para el envío
            }
        });

        // Lógica del botón "Agregar" (MODIFICADA)
        const btnAgregar = shadow.querySelector('.btn-agregar');
        btnAgregar.addEventListener('click', async () => {
            const titulo = shadow.getElementById('titulo').value.trim();
            const descripcion = shadow.getElementById('descripcion').value.trim();

            if (this.calificacionSeleccionada === 0) {
                alert("Por favor, selecciona una calificación.");
                return;
            }

            if (!titulo || !descripcion) {
                alert("Por favor, completa el título y la reseña.");
                return;
            }

            try {
                // Llama al servicio para agregar la reseña
                const nuevaResenia = await ReseniasService.agregarResenia(
                    this.calificacionSeleccionada,
                    titulo,
                    descripcion
                );

                console.log('Reseña agregada con éxito:', nuevaResenia);
                alert("¡Reseña agregada con éxito!");

                page('/home-page');

            } catch (error) {
                console.error("Error al agregar la reseña:", error);
                alert("Ocurrió un error al intentar agregar la reseña.");
            }
        });
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "../FrontLaVitrina/src/pages/agregarResenia/agregarResenia.css");
        shadow.appendChild(link);
    }
}