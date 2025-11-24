import { PublicacionService } from '../../services/publicacion.service.js';

export class EditarPublicacionPage extends HTMLElement {
    constructor() {
        super();
        this.archivosImagenes = [];
        this.publicacion = null;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.#agregarEstilos(shadow);
        this.#render(shadow);

        const publicacionId = this.getAttribute('id-publicacion');

        if (!publicacionId) {
            console.error("No se proporcionó ID de la publicación");
            return;
        }

        // Cargar datos de la publicación
        await this.#cargarDatos(shadow, publicacionId);

        this.#agregarEventListeners(shadow);
    }

    async #cargarDatos(shadow, publicacionId) {
        try {
            // Obtener la publicación del servicio
            this.publicacion = await PublicacionService.obtenerPublicacion(publicacionId);

            if (!this.publicacion) {
                console.error("Publicación no encontrada");
                return;
            }

            // Llenar los campos del formulario
            shadow.getElementById('titulo').value = this.publicacion.titulo || '';
            shadow.getElementById('descripcion').value = this.publicacion.descripcion || '';
            shadow.getElementById('precio').value = this.publicacion.precio || 0;

            // Seleccionar categoría
            const categoriaSelect = shadow.getElementById('categoria');
            for (let option of categoriaSelect.options) {
                if (option.text === this.publicacion.categoria) {
                    option.selected = true;
                    break;
                }
            }

            // Cargar etiquetas
            if (this.publicacion.etiquetas && this.publicacion.etiquetas.length > 0) {
                const tagContainer = shadow.getElementById('tag-container');
                this.publicacion.etiquetas.forEach(etiqueta => {
                    this.#crearTag(etiqueta, tagContainer);
                });
            }

            // Establecer tipo de publicación
            if (this.publicacion.tipoPublicacion === 'subasta') {
                shadow.getElementById('subasta').checked = true;
                shadow.getElementById('fechas-subasta').className = 'subasta-campos';

                if (this.publicacion.inicioSubasta) {
                    shadow.getElementById('inicio-subasta').value = this.publicacion.inicioSubasta;
                }
                if (this.publicacion.finSubasta) {
                    shadow.getElementById('fin-subasta').value = this.publicacion.finSubasta;
                }
            }

            // ✅ Cargar imágenes existentes
            await this.#cargarImagenesExistentes(shadow);

        } catch (error) {
            console.error("Error al cargar la publicación:", error);
            alert("Error al cargar los datos de la publicación");
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
                    // Remover del array también
                    const index = this.archivosImagenes.findIndex(f => f.name === file.name);
                    if (index > -1) {
                        this.archivosImagenes.splice(index, 1);
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
                        <input type="file" id="input-subir-imagen" accept="image/*" multiple hidden> 
                        <div class="contenido">
                            <img class="icono" src="../FrontLaVitrina/src/assets/agregarImagen.png">
                            <span>Agregar</span>
                        </div>
                    </label>
                </div>
                <div class="datos">
                    <div class="contenedor-input">
                        <h1>Editar publicación</h1>
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
                                <option value="0">Seleccionar</option>
                                <option value="1">Electrónica</option>
                                <option value="2">Ropa</option>
                                <option value="3">Hogar</option>
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
                    <button type="submit" class="btn-editar">Editar</button>
                </div>
            </div>
        </div>
        `
    }

    #agregarEventListeners(shadow) {
        const inputSubirImagen = shadow.getElementById('input-subir-imagen');
        const imagenesContenedor = shadow.getElementById('imagenes-contenedor');
        const agregarBoton = shadow.querySelector('.agregar');

        inputSubirImagen.addEventListener('change', (event) => {
            const files = event.target.files;

            if (files.length === 0) return;

            this.archivosImagenes.push(...Array.from(files));

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

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
                        const index = this.archivosImagenes.indexOf(file);
                        if (index > -1) {
                            this.archivosImagenes.splice(index, 1);
                        }
                        imagenesContenedor.removeChild(nuevaImagen);
                    });

                    imagenesContenedor.insertBefore(nuevaImagen, agregarBoton);
                };

                reader.readAsDataURL(file);
            }

            event.target.value = '';
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
            const titulo = shadow.getElementById('titulo').value;
            const descripcion = shadow.getElementById('descripcion').value;
            const precio = parseFloat(shadow.getElementById('precio').value) || 0;
            const categoriaElement = shadow.getElementById('categoria');
            const categoria = categoriaElement.options[categoriaElement.selectedIndex].text;
            const tipoPublicacion = shadow.getElementById('venta').checked ? 'venta' : 'subasta';

            const etiquetasElementos = shadow.querySelectorAll('.tag-text');
            const etiquetas = Array.from(etiquetasElementos).map(el => el.textContent.replace(' | ', '').trim());

            let datosPublicacion = {
                id: this.getAttribute('id-publicacion'),
                titulo,
                descripcion,
                precio,
                categoria,
                tipoPublicacion,
                etiquetas,
                imagenes: this.archivosImagenes,
            };

            if (tipoPublicacion === 'subasta') {
                const inicioSubasta = shadow.getElementById('inicio-subasta').value;
                const finSubasta = shadow.getElementById('fin-subasta').value;
                datosPublicacion.inicioSubasta = inicioSubasta;
                datosPublicacion.finSubasta = finSubasta;
            }

            try {
                const publicacionEditada = await PublicacionService.editarPublicacion(datosPublicacion.id, datosPublicacion);
                console.log('Publicación editada:', publicacionEditada);
                alert('Publicación Editada con éxito.');
                page('/home-page');
            } catch (error) {
                console.error('Error al editar la publicación:', error);
                alert(`Error: ${error.message || 'Inténtelo de nuevo.'}`);
            }
        });
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "FrontLaVitrina/src/pages/editarPublicacion/editarPublicacion.css");
        shadow.appendChild(link);
    }
}