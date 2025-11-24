export class AgregarReseniaPage extends HTMLElement {
    constructor() {
        super();
        // Estado para almacenar la calificación seleccionada
        this.calificacionSeleccionada = 0; 
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <div class="contenedor-main">
            <div class="contenedor">
                <div class="datos-vendedor">
                    <h2>Pedrito Sola</h2>
                    <img class="imagen-vendedor" src="FrontLaVitrina/src/assets/pedrito.png" alt="">
                    <h4>Puntaje del vendedor</h4>
                    <div class="rating">
                        <span class="rating-numero">4.9</span>
                        <span class="estrellas">★ ★ ★ ★ ★</span>
                    </div>
                    <p class="total-reseñas">Basado en 108 reseñas</p>
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
        `
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
        // Lógica del botón "Agregar" (ejemplo)
        const btnAgregar = shadow.querySelector('.btn-agregar');
        btnAgregar.addEventListener('click', () => {
            const titulo = shadow.getElementById('titulo').value;
            const descripcion = shadow.getElementById('descripcion').value;
            
            if (this.calificacionSeleccionada === 0) {
                alert("Por favor, selecciona una calificación.");
                return;
            }
            
            console.log('Datos de la reseña a enviar:');
            console.log(`Calificación: ${this.calificacionSeleccionada}`);
            console.log(`Título: ${titulo}`);
            console.log(`Descripción: ${descripcion}`);
            // Aquí iría la llamada a la API para guardar la reseña
        });

    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "FrontLaVitrina/src/pages/agregarResenia/agregarResenia.css");
        shadow.appendChild(link);
    }
}