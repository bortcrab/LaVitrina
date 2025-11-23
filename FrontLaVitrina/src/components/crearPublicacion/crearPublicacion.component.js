export class CrearPublicacionComponent extends HTMLElement {
    constructor() {
        super();
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
                <div class="imagenes" id="imagenes-contenedor">
                    <label class="agregar">
                        <input type="file" id="input-subir-imagen" accept="image/*" multiple hidden> 
                        <div class="contenido">
                            <img class="icono" src="FrontLaVitrina/src/assets/agregarImagen.png">
                            <span>Agregar</span>
                        </div>
                    </label>
                </div>
                <div class="datos">
                    <div class="contenedor-input">
                        <h1>Crear publicación</h1>
                        <label for="titulo">Título</label>
                        <input type="text" name="titulo" id="titulo" placeholder='ej. "Playera vintage de algodón"' />
                    </div>
                    <div class="contenedor-input">
                        <label for="descripcion">Descripción</label>
                        <textarea name="descripcion" id="descripcion"
                            placeholder="Describe tu producto o servicio con detalle (características, tamaño, color, etc)"></textarea>
                    </div>
                    <div class="contenedor-input" id="contenedor-horizontal">
                        <label for="precio">Precio</label>
                        <input type="number" name="precio" id="precio" placeholder='$0.00' />
                        <label for="categoria">Categoría</label>
                        <select name="categoria" id="categoria">
                            <option value="0">Seleccionar</option>
                            <option value="1">Electrónica</option>
                            <option value="2">Ropa</option>
                            <option value="3">Hogar</option>
                        </select>
                    </div>
                    <div class="contenedor-input">
                        <label for="etiquetas">Etiquetas</label>
                        <input type="text" name="etiquetas" id="etiquetas" placeholder='Agrega una etiqueta y presiona Enter...' />
                    </div>
                    <div class="tag-container" id="tag-container">
                    </div>
                    <div class="contenedor-input">
                        <label for="tipo-publicacion">Tipo de publicación</label>
                        <div class="toggle-container">
                            <input type="radio" id="venta" name="tipo-publicacion" checked>
                            <label for="venta" class="toggle-btn">Venta</label>
                            <input type="radio" id="subasta" name="tipo-publicacion">
                            <label for="subasta" class="toggle-btn">Subasta</label>
                        </div>
                    </div>
                    <div class="subasta-campos-escondidos" id="fechas-subasta">
                        <div class="contenedor-input">
                            <label for="inicio-subasta">Inicio de subasta</label>
                            <input type="datetime-local" id="inicio-subasta" placeholder="">
                        </div>

                        <div class="contenedor-input">
                            <label for="fin-subasta">Fin de subasta</label>
                            <input type="datetime-local" id="fin-subasta">
                        </div>
                    </div>
                    <button type="submit" class="btn-crear">Crear</button>
                </div>
            </div>
        </div>
        `
    };

    #agregarEventListeners(shadow) {
        const inputSubirImagen = shadow.getElementById('input-subir-imagen');
        const imagenesContenedor = shadow.getElementById('imagenes-contenedor');
        const agregarBoton = shadow.querySelector('.agregar');

        inputSubirImagen.addEventListener('change', (event) => {
            const files = event.target.files;

            if (files.length === 0) return;

            let imagesToLoad = files.length;
            let imagesCurrentlyDisplayed = imagenesContenedor.querySelectorAll('.imagen-producto').length;

            for (let i = 0; i < imagesToLoad; i++) {
                const file = files[i];

                // Salir si ya no hay espacio
                if (!file.type.startsWith('image/')) {
                    continue;
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                    const nuevaImagen = document.createElement('img');
                    nuevaImagen.classList.add('imagen-producto');
                    nuevaImagen.src = e.target.result;
                    nuevaImagen.alt = 'Imagen subida';

                    nuevaImagen.addEventListener('click', () => {
                        imagenesContenedor.removeChild(nuevaImagen);
                    });

                    imagenesContenedor.insertBefore(nuevaImagen, agregarBoton);
                };

                reader.readAsDataURL(file);
                imagesCurrentlyDisplayed++;
            }

            event.target.value = '';
        });


        const etiquetasInput = shadow.getElementById('etiquetas');
        const tagContainer = shadow.getElementById('tag-container');

        // Función para crear y añadir un nuevo tag al DOM
        const crearTag = (texto) => {
            const tagDiv = document.createElement('div');
            tagDiv.classList.add('tag');

            const textSpan = document.createElement('span');
            textSpan.classList.add('tag-text');
            textSpan.textContent = texto + ' | ';

            const removeLink = document.createElement('a');
            removeLink.href = 'javascript:void(0)';
            removeLink.textContent = '×';

            removeLink.addEventListener('click', () => {
                tagContainer.removeChild(tagDiv);
            });

            tagDiv.appendChild(textSpan);
            tagDiv.appendChild(removeLink);

            tagContainer.appendChild(tagDiv);
        };


        etiquetasInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                const tagText = etiquetasInput.value.trim();

                if (tagText) {
                    crearTag(tagText);
                    etiquetasInput.value = '';
                }
            }
        });

        const tipoVenta = shadow.getElementById('venta');
        const tipoSubasta = shadow.getElementById('subasta');
        const fechasSubasta = shadow.getElementById('fechas-subasta');

        tipoVenta.addEventListener('click', () => {
            if (fechasSubasta) {
                fechasSubasta.className = 'subasta-campos-escondidos';
            }
        });

        tipoSubasta.addEventListener('click', () => {
            if (fechasSubasta) {
                fechasSubasta.className = 'subasta-campos';
            }
        });
    }


    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "FrontLaVitrina/src/components/crearPublicacion/crearPublicacion.component.css");
        shadow.appendChild(link);
    }
}