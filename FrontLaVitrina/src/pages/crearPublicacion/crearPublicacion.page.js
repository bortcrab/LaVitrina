import { PublicacionService } from '../../services/publicacion.service.js';

export class CrearPublicacionPage extends HTMLElement {

    constructor() {
        super();
        this.archivosImagenes = [];
        this.categorias = []; // Inicializar
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#agregarEventListeners(shadow);
        this.#cargarCategorias(shadow);
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
                    <div class="contenedor-horizontal">
                        <div class="contenedor-input-horizontal">
                            <label for="precio">Precio</label>
                            <input type="text" name="precio" id="precio" placeholder='$0.00' />
                        </div>
                        <div class="contenedor-input-horizontal">
                            <label for="categoria">Categoría</label>
                            <select name="categoria" id="categoria">
                            </select>
                        </div>
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
            // Almacenar los archivos en la propiedad del componente
            this.archivosImagenes.push(...Array.from(files));

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

        // FORMATEO DE PRECIO EN TIEMPO REAL
        const precioInput = shadow.getElementById('precio');

        // Función para formatear el precio
        const formatearPrecio = (valor) => {
            // Remover todo excepto números y punto decimal
            let numero = valor.replace(/[^\d.]/g, '');

            // Asegurar solo un punto decimal
            const partes = numero.split('.');
            if (partes.length > 2) {
                numero = partes[0] + '.' + partes.slice(1).join('');
            }

            // Limitar a 2 decimales
            if (partes[1] && partes[1].length > 2) {
                numero = parseFloat(numero).toFixed(2);
            }

            // Si está vacío, retornar vacío
            if (!numero || numero === '.') return '';

            // Convertir a número y formatear con comas
            const valorNumerico = parseFloat(numero);
            if (isNaN(valorNumerico)) return '';

            // Separar parte entera y decimal
            const [entero, decimal] = numero.split('.');

            // Formatear parte entera con comas
            const enteroFormateado = parseInt(entero).toLocaleString('es-MX');

            // Retornar con o sin decimales
            return decimal !== undefined ? `${enteroFormateado}.${decimal}` : enteroFormateado;
        };

        precioInput.addEventListener('input', (e) => {
            const input = e.target;
            const cursorPos = input.selectionStart;
            const valorAnterior = input.value;

            // Obtener solo números y punto
            const valorLimpio = input.value.replace(/[^\d.]/g, '');

            // Formatear y mostrar
            const valorFormateado = formatearPrecio(valorLimpio);
            input.value = valorFormateado ? `$${valorFormateado}` : '';

            // Calcular nueva posición del cursor
            const longitudAnterior = valorAnterior.length;
            const longitudNueva = input.value.length;
            const diferencia = longitudNueva - longitudAnterior;

            // Ajustar cursor
            let nuevaPosicion = cursorPos + diferencia;
            if (nuevaPosicion < 1) nuevaPosicion = 1; // Después del $
            if (nuevaPosicion > input.value.length) nuevaPosicion = input.value.length;

            input.setSelectionRange(nuevaPosicion, nuevaPosicion);
        });

        // Al hacer focus, mover cursor al final
        precioInput.addEventListener('focus', (e) => {
            const input = e.target;
            setTimeout(() => {
                const length = input.value.length;
                input.setSelectionRange(length, length);
            }, 0);
        });

        // Validar al salir del campo
        precioInput.addEventListener('blur', (e) => {
            const input = e.target;
            if (input.value && !input.value.startsWith('$')) {
                const valorLimpio = input.value.replace(/[^\d.]/g, '');
                const valorFormateado = formatearPrecio(valorLimpio);
                input.value = valorFormateado ? `$${valorFormateado}` : '';
            }
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

        const btnCrear = shadow.querySelector('.btn-crear');
        btnCrear.addEventListener('click', async () => {
            // 1. Recolectar datos del formulario
            const titulo = shadow.getElementById('titulo').value.trim();
            const descripcion = shadow.getElementById('descripcion').value.trim();

            // CORRECCIÓN: Limpiar el formato del precio antes de convertir
            const precioElement = shadow.getElementById('precio');
            const precioLimpio = precioElement.value.replace(/[^\d.]/g, ''); // Remover $, comas, espacios
            const precio = parseFloat(precioLimpio) || 0;

            const categoriaElement = shadow.getElementById('categoria');
            const categoriaValue = categoriaElement.value;
            const tipoPublicacion = shadow.getElementById('venta').checked ? 'venta' : 'subasta';

            const etiquetasElementos = shadow.querySelectorAll('.tag-text');
            const etiquetas = Array.from(etiquetasElementos).map(el => el.textContent.replace(' | ', '').trim());

            // 2. Preparar datos de la publicación
            let datosPublicacion = {
                titulo,
                descripcion,
                precio,
                etiquetas,
                imagenes: this.archivosImagenes,
                idCategoria: categoriaValue,
                idUsuario: 1
            };

            // 3. Agregar datos de subasta si aplica
            let mensajeExito;
            if (tipoPublicacion === 'subasta') {
                const inicioSubasta = shadow.getElementById('inicio-subasta').value;
                const finSubasta = shadow.getElementById('fin-subasta').value;
                datosPublicacion.inicioSubasta = inicioSubasta;
                datosPublicacion.finSubasta = finSubasta;
                mensajeExito = "Subasta creada con éxito.";
            } else {
                mensajeExito = "Publicación creada con éxito.";
            }

            // 4. Llamar al servicio para crear la publicación
            try {
                // Deshabilitar el botón mientras se procesa
                btnCrear.disabled = true;
                btnCrear.textContent = 'Creando...';
                console.log(JSON.stringify(datosPublicacion));
                const publicacionCreada = await PublicacionService.crearPublicacion(datosPublicacion);

                console.log('Publicación creada. Objeto de respuesta:', publicacionCreada);
                alert(mensajeExito);

                page('/home-page');
            } catch (error) {
                const mensaje = error.message;
                // "AAAAAError: El título es obligatorio., La descripción es obligatoria., El precio debe ser mayor a 0."

                // 1. Quitar "AAAAAError: "
                const limpio = mensaje.replace(/^.*Error:\s*/, "");

                // 2. Separar por comas
                const lista = limpio.split(",").map(e => e.trim()).filter(e => e.length > 0);

                // 3. Convertir a viñetas
                const textoConViñetas = lista.map(e => "• " + e).join("\n");

                alert('Por favor corrige los siguientes errores:\n\n' + textoConViñetas);

                // Rehabilitar el botón
                btnCrear.disabled = false;
                btnCrear.textContent = 'Crear';
                throw error;
            }
        });
    }

    /**
     * @private
     * Obtiene las categorías del servicio y las inyecta en el <select> del DOM.
     * @param {ShadowRoot} shadow El Shadow DOM del componente.
     */
    async #cargarCategorias(shadow) {
        try {
            console.log('Iniciando carga de categorías...');

            // 1. Llamar al servicio para obtener los datos
            const categoriasObtenidas = await PublicacionService.obtenerCategorias();

            // 2. Almacenar internamente
            this.categorias = categoriasObtenidas;

            // 3. Renderizar las opciones en el select
            const selectCategoria = shadow.getElementById('categoria');

            // Si hay categorías, llenar el select
            if (categoriasObtenidas && categoriasObtenidas.length > 0) {
                // Mapear el array de categorías a elementos <option>
                const opcionesHTML = categoriasObtenidas.map(cat =>
                    `<option value="${cat.id}">${cat.nombre}</option>`
                ).join('');

                // Agregar las nuevas opciones, manteniendo la primera opción 'Seleccionar'
                selectCategoria.innerHTML += opcionesHTML;
                console.log(`Categorías cargadas y renderizadas: ${this.categorias.length}`);
            } else {
                console.warn('El servicio no devolvió categorías o la lista está vacía.');
                // Opcional: Mostrar un mensaje en el select
                selectCategoria.innerHTML += `<option value="0" disabled>No hay categorías disponibles</option>`;
            }

        } catch (error) {
            console.error('Error al cargar y renderizar categorías:', error);
            // Mostrar un mensaje de error en el UI o dejar el select deshabilitado
            const selectCategoria = shadow.getElementById('categoria');
            selectCategoria.innerHTML = `<option value="0" disabled>Error de carga</option>`;
            selectCategoria.disabled = true;
            // Opcional: Mostrar un alert o un mensaje dentro de la página
            // alert('Hubo un error al cargar la lista de categorías.');
        }
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "FrontLaVitrina/src/pages/crearPublicacion/crearPublicacion.css");
        shadow.appendChild(link);
    }
}