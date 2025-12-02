import { UbicacionService } from '../../services/ubicacion.service.js';

export class RegistrarUsuarioComponent extends HTMLElement {
    constructor() {
        super();
        this.pasoActual = 1;
        this.datosRegistro = {};
        this.cssUrl = new URL('./registrar.component.css', import.meta.url).href;
        this.logoBlancoURL = new URL('../../assets/logoBlanco.png', import.meta.url).href;
        this.registrarURL = new URL('../../assets/registrar.png', import.meta.url).href;
        this.registrar2URL = new URL('../../assets/registrar2.png', import.meta.url).href;
        this.debounceTimer = null;
        this.ciudadSeleccionada = false;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEstilosExternos(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
        <div class="all">
            <div class="login-form side-div paso-1 ${this.pasoActual === 1 ? 'activo' : ''}">
                <div class="form-container">
                    <div class="header">
                        <h3>¡Crea tu cuenta!</h3>
                        <span class="subtitle">Ingresa la información solicitada.</span>
                    </div>

                    <form id="formPaso1">
                        <div class="input-group">
                            <label>Nombre</label>
                            <input type="text" id="nombres" maxlength="255" placeholder="Nombres" required>
                        </div>

                        <div class="input-row">
                            <div class="input-group half">
                                <input type="text" id="apellidoPaterno" maxlength="255" placeholder="Apellido paterno" required>
                            </div>
                            <div class="input-group half">
                                <input type="text" id="apellidoMaterno" maxlength="255" placeholder="Apellido materno" required>
                            </div>
                        </div>

                        <div class="input-row">
                            <div class="input-group half relative-container">
                                <label>Ciudad</label>
                                <input type="text" id="ciudad" placeholder="Busca tu ciudad..." autocomplete="off" required>
                                
                                <ul id="listaSugerencias" class="suggestions-list" style="display: none;"></ul>
                            </div>
                            
                            <div class="input-group half">
                                <label>Fecha de nacimiento</label>
                                <input type="date" id="fechaNacimiento" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Número de celular</label>
                            <input type="tel" id="telefono" maxlength="10" placeholder="###-###-####" required>
                        </div>
                        <div class="error-message" id="errorMessageDatos"></div>
                        <button type="submit">Siguiente</button>
                    </form>

                    <p class="register-text">
                        ¿Ya tienes una cuenta?
                        <a href="#" class="registrarse" id="linkIniciarSesion1">Inicia sesión</a>
                    </p>
                </div>
            </div>

            <div class="login-form side-div paso-2 ${this.pasoActual === 2 ? 'activo' : ''}">
                <div class="form-container">
                    <div class="header">
                        <h3>¡Crea tu cuenta!</h3>
                        <span class="subtitle">Ya casi terminamos...</span>
                    </div>

                    <form id="formPaso2">
                        <div class="input-group input-foto">
                            <label>Foto de perfil (opcional)</label>
                            <div class="photo-upload">
                                <input type="file" id="photoInput" accept="image/*" style="display: none;">
                                <label for="photoInput" class="photo-label">
                                    <div class="photo-placeholder" id="photoPreview">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <path d="M20 8V32M8 20H32" stroke="#999" stroke-width="3" stroke-linecap="round" />
                                        </svg>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Correo electrónico</label>
                            <input type="email" id="correo" maxlength="100" placeholder="ejemplo@direccion.com" required>
                        </div>

                        <div class="input-group">
                            <label>Contraseña</label>
                            <input type="password" id="contrasenia" maxlength="50"  placeholder="*******" required>
                        </div>

                        <div class="input-group">
                            <label>Confirmar contraseña</label>
                            <input type="password" id="confirmarContrasenia" maxlength="50" placeholder="********" required>
                        </div>

                        <div class="error-message" id="errorMessage"></div>
                        <div class="success-message" id="successMessage"></div>

                        <div class="button-row">
                            <button type="button" class="btn-secondary" id="btnVolver">Volver</button>
                            <button type="submit" class="btn-primary">Crear cuenta</button>
                        </div>
                    </form>

                    <p class="register-text">
                        ¿Ya tienes una cuenta?
                        <a href="#" class="registrarse" id="linkIniciarSesion2">Inicia sesión</a>
                    </p>
                </div>
            </div>

            <div class="image-side side-div">
                <img src="${this.pasoActual === 1 ? this.registrarURL : this.registrar2URL}" 
                     alt="Imagen de registro" id="imagenLateral">
                <div class="overlay"></div>
                <div class="content-over-image">
                    <div class="logo-container">
                        <img class="brand-logo" src="${this.logoBlancoURL}" alt="La Vitrina">
                    </div>
                    <h2 class="brand-slogan" id="sloganTexto">
                        ${this.pasoActual === 1
                ? 'Tu Página de Compras y Ventas en<br>Línea de Confianza.'
                : 'Vender Productos en Línea Nunca<br>Había Sido Tan Fácil.'}
                    </h2>
                </div>
            </div>
        </div>
        `;
    }

    #agregarEventListeners(shadow) {
        const formPaso1 = shadow.getElementById('formPaso1');
        formPaso1?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.#avanzarPaso2(shadow);
        })

        const inputCiudad = shadow.getElementById('ciudad');
        const listaSugerencias = shadow.getElementById('listaSugerencias');

        inputCiudad?.addEventListener('input', (e) => {
            this.ciudadSeleccionada = false;

            const termino = e.target.value;

            if (termino === '') {
                this.mostrarError('', false);
            }
            this.#manejarBusqueda(termino, listaSugerencias);
        });

        document.addEventListener('click', (e) => {
            if (e.composedPath && !e.composedPath().includes(inputCiudad)) {
                listaSugerencias.style.display = 'none';
            }
        });

        const formPaso2 = shadow.getElementById('formPaso2');
        formPaso2?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.#registrarUsuario(shadow);
        });

        const btnVolver = shadow.getElementById('btnVolver');
        btnVolver?.addEventListener('click', () => {
            this.#volverPaso1(shadow);
        });

        const linkIniciarSesion1 = shadow.getElementById('linkIniciarSesion1');
        const linkIniciarSesion2 = shadow.getElementById('linkIniciarSesion2');

        linkIniciarSesion1?.addEventListener('click', (e) => this.#irALogin(e));
        linkIniciarSesion2?.addEventListener('click', (e) => this.#irALogin(e));

        const photoInput = shadow.getElementById('photoInput');
        photoInput?.addEventListener('change', (e) => {
            this.#mostrarPreviewFoto(e, shadow);
        });
    }

    #irALogin(e) {
        e.preventDefault();
        page('/iniciar-sesion');
    }

    #manejarBusqueda(termino, listaUl) {
        clearTimeout(this.debounceTimer);

        if (termino.length < 3) {
            listaUl.style.display = 'none';
            return;
        }

        this.debounceTimer = setTimeout(async () => {
            const ciudades = await UbicacionService.buscarCiudades(termino);
            this.#mostrarSugerencias(ciudades, listaUl);
        }, 300);
    }

    #mostrarSugerencias(ciudades, listaUl) {
        listaUl.innerHTML = '';
        if (!ciudades || ciudades.length === 0) {
            listaUl.style.display = 'none';
            return;
        }

        ciudades.forEach(nombreCiudad => {
            const li = document.createElement('li');
            li.textContent = nombreCiudad;

            li.addEventListener('click', () => {
                const inputCiudad = this.shadowRoot.getElementById('ciudad');
                inputCiudad.value = nombreCiudad;
                this.ciudadSeleccionada = true;
                this.mostrarError('', false)
                listaUl.style.display = 'none';
            });

            listaUl.appendChild(li);
        });

        listaUl.style.display = 'block';
    }

    #avanzarPaso2(shadow) {
        const nombres = shadow.getElementById('nombres').value.trim();
        const apellidoPaterno = shadow.getElementById('apellidoPaterno').value.trim();
        const apellidoMaterno = shadow.getElementById('apellidoMaterno').value.trim();
        const ciudad = shadow.getElementById('ciudad').value;
        const fechaNacimiento = shadow.getElementById('fechaNacimiento').value;
        const telefono = shadow.getElementById('telefono').value.trim();


        if (ciudad.length > 0 && !this.ciudadSeleccionada) {
            this.mostrarError("Debes seleccionar una ciudad válida de la lista sugerida.", false);
            return;
        }

        if (!ciudad) {
            this.mostrarError("El campo ciudad es obligatorio.", false);
            return;
        }

        const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        const inputsTexto = ['nombres', 'apellidoPaterno', 'apellidoMaterno'];
        for (const id of inputsTexto) {
            const input = shadow.getElementById(id);
            if (!soloLetrasRegex.test(input.value.trim())) {
                console.log("error en " + id)
                this.mostrarError(`Los nombres y apellidos solo deben contener letras y espacios.`, false);
                return;
            }
        }

        if (!fechaNacimiento) {
            this.mostrarError("La fecha de nacimiento es requerida.", false);
            return;
        }

        const [anioNac, mesNac, diaNac] = fechaNacimiento.split('-').map(Number);
        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        const mesActual = hoy.getMonth() + 1;
        const diaActual = hoy.getDate();

        let edad = anioActual - anioNac;

        if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
            edad--;
        }

        if (edad < 15) {
            this.mostrarError("Debes tener al menos 15 años para registrarte.", false);
            return;
        }

        console.log(fechaNacimiento)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(telefono)) {
            this.mostrarError("El teléfono debe tener exactamente 10 dígitos numéricos.", false);
            return;
        }



        this.datosRegistro = {
            nombres, apellidoPaterno, apellidoMaterno, ciudad, fechaNacimiento, telefono
        };

        const btn = shadow.querySelector('#formPaso1 button[type="submit"]');
        if (btn) {
            btn.dataset.originalText = btn.textContent;
            btn.textContent = "Verificando...";
            btn.disabled = true;
        }


        this.dispatchEvent(new CustomEvent('verificar-paso-1', {
            bubbles: true,
            composed: true,
            detail: { telefono: telefono }
        }));

    }

    confirmarAvancePaso2() {
        const shadow = this.shadowRoot;
        this.#restaurarBoton(shadow);
        this.mostrarError('', false);
        this.pasoActual = 2;
        this.#aplicarTransicion(shadow);
    }

    detenerCargaPaso1() {
        this.#restaurarBoton(this.shadowRoot);
    }


    #restaurarBoton(shadow) {
        const btn = shadow.querySelector('#formPaso1 button[type="submit"]');
        if(btn && btn.dataset.originalText) {
            btn.textContent = btn.dataset.originalText;
            btn.disabled = false;
        }
    }
    
    #volverPaso1(shadow) {
        this.pasoActual = 1;
        this.#aplicarTransicion(shadow);
    }

    #aplicarTransicion(shadow) {
        const paso1 = shadow.querySelector('.paso-1');
        const paso2 = shadow.querySelector('.paso-2');
        const imagenLateral = shadow.getElementById('imagenLateral');
        const sloganTexto = shadow.getElementById('sloganTexto');

        if (this.pasoActual === 1) {
            paso2.classList.remove('activo');
            setTimeout(() => {
                paso1.classList.add('activo');
                imagenLateral.src = this.registrarURL;
                sloganTexto.innerHTML = 'Tu Página de Compras y Ventas en<br>Línea de Confianza.';
            }, 300);
        } else {
            paso1.classList.remove('activo');
            setTimeout(() => {
                paso2.classList.add('activo');
                imagenLateral.src = this.registrar2URL;
                sloganTexto.innerHTML = 'Vender Productos en Línea Nunca<br>Había Sido Tan Fácil.';
            }, 300);
        }
    }



    #registrarUsuario(shadow) {
        const nombre = shadow.getElementById('nombres').value.trim();
        const apellidoPaterno = shadow.getElementById('apellidoPaterno')
        const correo = shadow.getElementById('correo').value.trim();
        const contrasenia = shadow.getElementById('contrasenia').value;
        const confirmarContrasenia = shadow.getElementById('confirmarContrasenia').value;
        const errorMessage = shadow.getElementById('errorMessage');
        const successMessage = shadow.getElementById('successMessage');

        errorMessage.style.display = 'none';

        if (contrasenia !== confirmarContrasenia) {
            this.mostrarError('Las contraseñas no coinciden');
            return;
        }

        if (contrasenia.length < 8) {
            this.mostrarError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        const validatePassword = (contrasenia) => {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            return regex.test(contrasenia);
        };

        if (!validatePassword(contrasenia)) {
            this.mostrarError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial. ');
            return;
        }

        const photoInput = shadow.getElementById('photoInput');
        const archivoFoto = photoInput.files[0] || null;

        this.dispatchEvent(new CustomEvent('registro-submit', {
            bubbles: true,
            composed: true,
            detail: {
                ...this.datosRegistro,
                correo,
                contrasenia,
                foto: archivoFoto
            }
        }));
    }

    // Método público para ser llamado desde registrar.page.js
    mostrarError(mensaje, ultimoPaso = true) {
        const shadow = this.shadowRoot; // Accedemos al shadowRoot guardado o 'this.shadowRoot'
        if (!shadow) return;


        let errorMessage;

        if (ultimoPaso === true) {
            errorMessage = shadow.getElementById('errorMessage');
        }
        else {
            errorMessage = shadow.getElementById('errorMessageDatos');
        }
        //const successMessage = shadow.getElementById('successMessage');

        console.log(mensaje);
        if (errorMessage) {
            errorMessage.textContent = mensaje;
            errorMessage.style.display = 'block';

        } else {
            // Si mensaje está vacío, ocultamos
            errorMessage.style.display = 'none';
        }
    }

    #mostrarPreviewFoto(e, shadow) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const photoPreview = shadow.getElementById('photoPreview');
                photoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">`;
            };
            reader.readAsDataURL(file);
        }
    }

    #agregarEstilosExternos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}