import { PublicacionService } from '../../services/publicacion.service.js';

export class EditarPublicacionPage extends HTMLElement {
    constructor() {
        super();
        this.archivosImagenes = [];
        this.categorias = [];
        this.cssUrl = new URL('./editarPublicacion.css', import.meta.url).href;
        this.agregarImagenUrl = new URL('../../assets/agregarImagen.png', import.meta.url).href;
        this.publicacion = null;
        this.publicacionId = null;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.publicacionId = this.getAttribute('id');
        if (!this.publicacionId) {
            console.error("No se proporcionó ID de la publicación");
            return;
        }
        // Cargar datos de la publicación
        await this.#cargarDatos(shadow, this.publicacionId);
        this.#agregarEventListeners(shadow);
    }

    async #cargarDatos(shadow, publicacionId) {
        try {
            // Obtener publicación desde servicio
            this.publicacion = await PublicacionService.obtenerPublicacion(publicacionId);

            if (!this.publicacion) {
                console.error("Publicación no encontrada");
                return;
            }

            // Tipo de publicación
            if (this.publicacion.tipo.toLowerCase() === 'subasta') {
                const respuesta = await PublicacionService.obtenerSubasta(publicacionId);

                const fechaInicioISO = respuesta.subasta.fechaInicio;
                const fechaFinISO = respuesta.subasta.fechaFin;

                const fechaInicioLocal = this.#convertirADatetimeLocal(fechaInicioISO);
                const fechaFinLocal = this.#convertirADatetimeLocal(fechaFinISO);

                shadow.getElementById('subasta').checked = true;
                shadow.getElementById('fechas-subasta').className = 'subasta-campos';
                shadow.getElementById('inicio-subasta').value = fechaInicioLocal || '';
                shadow.getElementById('fin-subasta').value = fechaFinLocal || '';
            }

            // Llenar campos
            shadow.getElementById('titulo').value = this.publicacion.titulo || '';
            shadow.getElementById('descripcion').value = this.publicacion.descripcion || '';
            shadow.getElementById('precio').value = "$" + this.#formatearPrecio(this.publicacion.precio) || 0;

            // Esperar a que las categorías se carguen completamente
            await this.#cargarCategorias(shadow);

            //Seleccionar categoría por NOMBRE
            const categoriaSelect = shadow.getElementById('categoria');
            if (this.publicacion.categoria) {
                // Buscar el ID de la categoría que coincida con el nombre
                const categoriaEncontrada = this.categorias.find(
                    cat => cat.nombre === this.publicacion.categoria.nombre
                );

                if (categoriaEncontrada) {
                    categoriaSelect.value = categoriaEncontrada.id;
                } else {
                    console.warn('No se encontró la categoría:', this.publicacion.categoria);
                }
            }

            // Cargar etiquetas
            if (Array.isArray(this.publicacion.etiquetas)) {
                const tagContainer = shadow.getElementById('tag-container');
                this.publicacion.etiquetas.forEach(etiqueta => {
                    this.#crearTag(etiqueta, tagContainer);
                });
            }

            // Cargar imágenes previamente guardadas
            await this.#cargarImagenesExistentes(shadow);

        } catch (error) {
            console.error("Error al cargar la publicación:", error);
            alert("Error al cargar los datos de la publicación");
        }
    }

    #convertirADatetimeLocal(isoString) {
        const fecha = new Date(isoString);

        // Obtener partes ajustadas al sistema
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');

        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${año}-${mes}-${dia}T${horas}:${minutos}`;
    }


    async #cargarCategorias(shadow) {
        try {
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
            } else {
                selectCategoria.innerHTML += `
                <option value="" disabled>No hay categorías disponibles</option>
            `;
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);

            const selectCategoria = shadow.getElementById('categoria');
            selectCategoria.innerHTML = `
            <option value="" disabled>Error al cargar categorías</option>
        `;
            selectCategoria.disabled = true;
        }
    }


    async #cargarImagenesExistentes(shadow) {
        if (!this.publicacion.imagenes || this.publicacion.imagenes.length === 0) {
            return;
        }

        const imagenesContenedor = shadow.getElementById('imagenes-contenedor');
        const agregarBoton = shadow.querySelector('.agregar');

        for (const imagenUrl of this.publicacion.imagenes) {
            try {
                // Convertir URL a File object
                const file = await this.#urlToFile(imagenUrl);
                this.archivosImagenes.push(file);

                // Mostrar la imagen en el contenedor
                const nuevaImagen = document.createElement('img');
                nuevaImagen.classList.add('imagen-producto');
                nuevaImagen.src = imagenUrl;
                nuevaImagen.alt = 'Imagen de la publicación';

                nuevaImagen.addEventListener('click', () => {
                    // Remover del array de archivos
                    const index = this.archivosImagenes.findIndex(f => f.name === file.name);
                    if (index > -1) {
                        this.archivosImagenes.splice(index, 1);
                    }

                    // Remover también del array de URLs de la publicación
                    const urlIndex = this.publicacion.imagenes.indexOf(imagenUrl);
                    if (urlIndex > -1) {
                        this.publicacion.imagenes.splice(urlIndex, 1);
                    }

                    imagenesContenedor.removeChild(nuevaImagen);
                });

                imagenesContenedor.insertBefore(nuevaImagen, agregarBoton);
            } catch (error) {
                console.error("Error al cargar imagen:", error);
            }
        }
    }

    // Función auxiliar para convertir URL a File
    async #urlToFile(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('/').pop() || 'imagen.jpg';
            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error("Error al convertir URL a File:", error);
            throw error;
        }
    }

    // Extraer la función crearTag para reutilizarla
    #crearTag(texto, tagContainer) {
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
                    <button type="submit" class="btn-editar">Editar</button>
                </div>
            </div>
        </div>
        `
    };

    // Función para formatear el precio
    #formatearPrecio(valor) {
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
                    event.target.value = '';
                    return;
                }
            }

            // Mostrar indicador de carga (opcional)
            agregarBoton.classList.add('uploading'); // Puedes agregar estilos CSS para esto

            let imagesToLoad = files.length;

            for (let i = 0; i < imagesToLoad; i++) {
                const file = files[i];

                if (!file.type.startsWith('image/')) {
                    continue;
                }

                try {
                    // Subir imagen a Cloudinary
                    console.log(`Subiendo imagen ${i + 1} de ${imagesToLoad} a Cloudinary...`);
                    const urlCloudinary = await PublicacionService.subirImagen(file);

                    // Agregar el archivo y la URL al array
                    this.archivosImagenes.push(file);
                    this.publicacion.imagenes.push(urlCloudinary);

                    // Crear preview de la imagen
                    const nuevaImagen = document.createElement('img');
                    nuevaImagen.classList.add('imagen-producto');
                    nuevaImagen.src = urlCloudinary; // Usar la URL de Cloudinary
                    nuevaImagen.alt = 'Imagen subida';

                    // Agregar evento de clic para eliminar
                    nuevaImagen.addEventListener('click', () => {
                        // Remover del array de archivos
                        const fileIndex = this.archivosImagenes.findIndex(f => f.name === file.name);
                        if (fileIndex > -1) {
                            this.archivosImagenes.splice(fileIndex, 1);
                        }

                        // Remover del array de URLs de Cloudinary
                        const urlIndex = this.publicacion.imagenes.indexOf(urlCloudinary);
                        if (urlIndex > -1) {
                            this.publicacion.imagenes.splice(urlIndex, 1);
                        }

                        imagenesContenedor.removeChild(nuevaImagen);
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

            event.target.value = '';
        });

        // FORMATEO DE PRECIO EN TIEMPO REAL
        const precioInput = shadow.getElementById('precio');


        precioInput.addEventListener('input', (e) => {
            const input = e.target;
            const cursorPos = input.selectionStart;
            const valorAnterior = input.value;

            // Obtener solo números y punto
            const valorLimpio = input.value.replace(/[^\d.]/g, '');

            // Formatear y mostrar
            const valorFormateado = this.#formatearPrecio(valorLimpio);
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
                const valorFormateado = this.#formatearPrecio(valorLimpio);
                input.value = valorFormateado ? `$${valorFormateado}` : '';
            }
        });

        const etiquetasInput = shadow.getElementById('etiquetas');
        const tagContainer = shadow.getElementById('tag-container');

        etiquetasInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                const tagText = etiquetasInput.value.trim();

                if (tagText) {
                    this.#crearTag(tagText, tagContainer);
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


        const btnEditar = shadow.querySelector('.btn-editar');
        btnEditar.addEventListener('click', async () => {
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

            const idUsuario = JSON.parse(localStorage.getItem("usuario"))?.id;
            let datosActualizados = {
                idUsuario,
                titulo,
                descripcion,
                precio,
                idCategoria: categoriaValue,
                tipoPublicacion,
                etiquetas,
                imagenes: this.publicacion.imagenes,
            };

            if (tipoPublicacion === 'subasta') {
                const inicioSubasta = shadow.getElementById('inicio-subasta').value;
                const finSubasta = shadow.getElementById('fin-subasta').value;
                datosActualizados.inicioSubasta = inicioSubasta;
                datosActualizados.finSubasta = finSubasta;
            }


            try {
                const publicacionEditada = await PublicacionService.editarPublicacion(this.publicacionId, datosActualizados);
                alert('Publicación Editada con éxito.');
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
                btnEditar.disabled = false;
                btnEditar.textContent = 'Editar';
                throw error;
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