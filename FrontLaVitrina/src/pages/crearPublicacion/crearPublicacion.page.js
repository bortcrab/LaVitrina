import { PublicacionService } from '../../services/publicacion.service.js';

export class CrearPublicacionPage extends HTMLElement {

    constructor() {
        super();
        this.archivosImagenes = [];
        this.urlsImagenesPublicacion = [];
        this.categorias = [];
        this.cssUrl = new URL('./crearPublicacion.css', import.meta.url).href;
        this.agregarImagenUrl = new URL('../../assets/agregarImagen.png', import.meta.url).href;
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
                        <input type="file" id="input-subir-imagen" accept="image/*" multiple hidden required>
                        <div class="contenido">
                            <img class="icono" src='${this.agregarImagenUrl}'>
                            <span>Agregar</span>
                        </div>
                    </label>
                </div>
                <div class="datos">
                    <div class="contenedor-input">
                        <h1>Crear publicación</h1>
                        <label for="titulo">Título</label>
                        <input type="text" name="titulo" id="titulo" placeholder='ej. "Playera vintage de algodón"' required />
                    </div>
                    <div class="contenedor-input">
                        <label for="descripcion">Descripción</label>
                        <textarea name="descripcion" id="descripcion"
                            placeholder="Describe tu producto o servicio con detalle (características, tamaño, color, etc)" required></textarea>
                    </div>
                    <div class="contenedor-horizontal">
                        <div class="contenedor-input-horizontal">
                            <label for="precio">Precio</label>
                            <input type="text" name="precio" id="precio" placeholder='$0.00' required />
                        </div>
                        <div class="contenedor-input-horizontal">
                            <label for="categoria">Categoría</label>
                            <select name="categoria" id="categoria" required>
                            </select>
                        </div>
                    </div>
                    <div class="contenedor-input">
                        <label for="etiquetas">Etiquetas</label>
                        <input type="text" name="etiquetas" id="etiquetas" placeholder='Agrega una etiqueta y presiona Enter...' required />
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
                            <input type="datetime-local" id="inicio-subasta" placeholder="" required>
                        </div>

                        <div class="contenedor-input">
                            <label for="fin-subasta">Fin de subasta</label>
                            <input type="datetime-local" id="fin-subasta" required>
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

        inputSubirImagen.addEventListener('change', async (event) => {
            const files = event.target.files;

            if (files.length === 0) return;

            // Validar el tamaño de las imágenes antes de subir
            for (let file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('Una o más imágenes pesan más de 5MB. Por favor elige imágenes más ligeras.');
                    inputSubirImagen.value = '';
                    return;
                }
            }

            // Mostrar indicador de carga (opcional)
            agregarBoton.classList.add('uploading');

            let imagesToLoad = files.length;

            for (let i = 0; i < imagesToLoad; i++) {
                const file = files[i];

                if (!file.type.startsWith('image/')) {
                    continue;
                }

                try {
                    // Subir imagen a Cloudinary
                    console.log(`Subiendo imagen ${i + 1} de ${imagesToLoad} a Cloudinary...`);
                    // Asegúrate de que PublicacionService.subirImagen(file) esté disponible aquí
                    const urlCloudinary = await PublicacionService.subirImagen(file);

                    // 📢 CAMBIO CLAVE: Agregar a las variables locales definidas arriba
                    this.archivosImagenes.push(file);
                    this.urlsImagenesPublicacion.push(urlCloudinary);

                    // Crear preview de la imagen
                    const nuevaImagen = document.createElement('img');
                    nuevaImagen.classList.add('imagen-producto');
                    nuevaImagen.src = urlCloudinary; // Usar la URL de Cloudinary
                    nuevaImagen.alt = 'Imagen subida';

                    // Agregar evento de clic para eliminar
                    nuevaImagen.addEventListener('click', () => {
                        // Remover del array de archivos (se usa la referencia al objeto 'file' del loop)
                        const fileIndex = this.archivosImagenes.findIndex(f => f.name === file.name && f.size === file.size);
                        if (fileIndex > -1) {
                            this.archivosImagenes.splice(fileIndex, 1);
                        }

                        // 📢 CAMBIO CLAVE: Remover del array local de URLs
                        const urlIndex = this.urlsImagenesPublicacion.indexOf(urlCloudinary);
                        if (urlIndex > -1) {
                            this.urlsImagenesPublicacion.splice(urlIndex, 1);
                        }

                        imagenesContenedor.removeChild(nuevaImagen);
                        console.log("URLs actuales:", this.urlsImagenesPublicacion);
                    });

                    imagenesContenedor.insertBefore(nuevaImagen, agregarBoton);

                } catch (error) {
                    console.error(`Error al subir imagen ${file.name}:`, error);

                    let mensaje = 'No pudimos subir una de las imágenes. ';

                    if (error.message === "ERROR_SUBIDA_IMAGEN") {
                        mensaje += 'Inténtalo de nuevo.';
                    } else if (error.message.includes("fetch") || error.message.includes("Network")) {
                        mensaje += 'Verifica tu conexión a internet.';
                    } else {
                        mensaje += 'Por favor inténtalo nuevamente.';
                    }

                    alert(mensaje);
                }
            }

            // Quitar indicador de carga
            agregarBoton.classList.remove('uploading');

            inputSubirImagen.value = '';
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
                imagenes: this.urlsImagenesPublicacion,
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
                console.log(JSON.stringify(datosPublicacion, null, 2));
                const publicacionCreada = await PublicacionService.crearPublicacion(datosPublicacion);

                console.log('Publicación creada. Objeto de respuesta:', publicacionCreada);
                alert(mensajeExito);

                page('/home-page');
            } catch (error) {
                const mensaje = error.message;

                // 1. Quitar "Error: "
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

            const categoriasObtenidas = await PublicacionService.obtenerCategorias();
            this.categorias = categoriasObtenidas || [];

            const selectCategoria = shadow.getElementById('categoria');

            // Siempre limpiamos para evitar duplicados
            selectCategoria.innerHTML = `
            <option value="" hidden>Selecciona una categoría</option>
        `;

            if (this.categorias.length > 0) {
                const opcionesHTML = this.categorias.map(cat =>
                    `<option value="${cat.id}">${cat.nombre}</option>`
                ).join('');

                selectCategoria.innerHTML += opcionesHTML;
                console.log(`Categorías renderizadas: ${this.categorias.length}`);
            } else {
                selectCategoria.innerHTML += `
                <option value="" disabled>No hay categorías disponibles</option>
            `;
            }

            return this.categorias;

        } catch (error) {
            console.error('Error al cargar categorías:', error);

            const selectCategoria = shadow.getElementById('categoria');
            selectCategoria.innerHTML = `
            <option value="" disabled>Error al cargar categorías</option>
        `;
            selectCategoria.disabled = true;
        }
    }


    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}