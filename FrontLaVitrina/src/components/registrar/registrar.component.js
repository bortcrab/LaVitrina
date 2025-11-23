export class RegistrarUsuarioComponent extends HTMLElement {
    constructor() {
        super();
        this.pasoActual = 1;
        this.datosRegistro = {};
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        this.#render(shadow);     
        this.#agregarEstilos(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
        <div class="all">
            <!-- Paso 1: Datos personales -->
            <div class="login-form side-div paso-1 ${this.pasoActual === 1 ? 'activo' : ''}">
                <div class="form-container">
                    <div class="header">
                        <h3>¡Crea tu cuenta!</h3>
                        <span class="subtitle">Ingresa la información solicitada.</span>
                    </div>

                    <form id="formPaso1">
                        <div class="input-group">
                            <label>Nombre</label>
                            <input type="text" id="nombres" placeholder="Nombres" required>
                        </div>

                        <div class="input-row">
                            <div class="input-group half">
                                <input type="text" id="apellidoPaterno" placeholder="Apellido paterno" required>
                            </div>
                            <div class="input-group half">
                                <input type="text" id="apellidoMaterno" placeholder="Apellido materno" required>
                            </div>
                        </div>

                        <div class="input-row">
                            <div class="input-group half">
                                <label>Ciudad</label>
                                <select id="ciudad" required>
                                    <option value="" disabled selected>Seleccione</option>
                                    <option value="CDMX">Ciudad de México</option>
                                    <option value="Guadalajara">Guadalajara</option>
                                    <option value="Monterrey">Monterrey</option>
                                    <option value="Tijuana">Tijuana</option>
                                    <option value="Puebla">Puebla</option>
                                </select>
                            </div>
                            <div class="input-group half">
                                <label>Fecha de nacimiento</label>
                                <input type="date" id="fechaNacimiento" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Número de celular</label>
                            <input type="tel" id="telefono" placeholder="###-###-####" required>
                        </div>

                        <button type="submit">Siguiente</button>
                    </form>

                    <p class="register-text">
                        ¿Ya tienes una cuenta?
                        <a href="#" class="registrarse" id="linkIniciarSesion1">Inicia sesión</a>
                    </p>
                </div>
            </div>

            <!-- Paso 2: Credenciales -->
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
                            <input type="email" id="correo" placeholder="ejemplo@direccion.com" required>
                        </div>

                        <div class="input-group">
                            <label>Contraseña</label>
                            <input type="password" id="contrasenia" placeholder="********" required>
                        </div>

                        <div class="input-group">
                            <label>Confirmar contraseña</label>
                            <input type="password" id="confirmarContrasenia" placeholder="********" required>
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

            <!-- Imagen lateral -->
            <div class="image-side side-div">
                <img src="./src/assets/${this.pasoActual === 1 ? 'registrar.png' : 'registrar2.png'}" 
                     alt="Imagen de registro" id="imagenLateral">
                <div class="overlay"></div>
                <div class="content-over-image">
                    <div class="logo-container">
                        <img class="brand-logo" src="./src/assets/logoBlanco.png" alt="La Vitrina">
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

        linkIniciarSesion1?.addEventListener('click', (e) => {
            e.preventDefault();
            page('/iniciar-sesion');
        });

        linkIniciarSesion2?.addEventListener('click', (e) => {
            e.preventDefault();
            page('/iniciar-sesion');
        });

        const photoInput = shadow.getElementById('photoInput');
        photoInput?.addEventListener('change', (e) => {
            this.#mostrarPreviewFoto(e, shadow);
        });
    }

    #avanzarPaso2(shadow) {
        this.datosRegistro = {
            nombres: shadow.getElementById('nombres').value.trim(),
            apellidoPaterno: shadow.getElementById('apellidoPaterno').value.trim(),
            apellidoMaterno: shadow.getElementById('apellidoMaterno').value.trim(),
            ciudad: shadow.getElementById('ciudad').value,
            fechaNacimiento: shadow.getElementById('fechaNacimiento').value,
            telefono: shadow.getElementById('telefono').value.trim()
        };
        this.pasoActual = 2;
        this.#aplicarTransicion(shadow);
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
                imagenLateral.src = './src/assets/registrar.png';
                sloganTexto.innerHTML = 'Tu Página de Compras y Ventas en<br>Línea de Confianza.';
            }, 300);
        } else {
            paso1.classList.remove('activo');
            setTimeout(() => {
                paso2.classList.add('activo');
                imagenLateral.src = './src/assets/registrar2.png';
                sloganTexto.innerHTML = 'Vender Productos en Línea Nunca<br>Había Sido Tan Fácil.';
            }, 300);
        }
    }

    #registrarUsuario(shadow) {
        const correo = shadow.getElementById('correo').value.trim();
        const contrasenia = shadow.getElementById('contrasenia').value;
        const confirmarContrasenia = shadow.getElementById('confirmarContrasenia').value;
        const errorMessage = shadow.getElementById('errorMessage');
        const successMessage = shadow.getElementById('successMessage');

        // Validaciones
        if (contrasenia !== confirmarContrasenia) {
            errorMessage.textContent = 'Las contraseñas no coinciden';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            return;
        }

        if (contrasenia.length < 6) {
            errorMessage.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            return;
        }

        // Obtener foto (si existe)
        const photoInput = shadow.getElementById('photoInput');
        const fotoPerfil = photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : null;

        // Disparar evento con todos los datos
        this.dispatchEvent(new CustomEvent('registroSubmit', {
            bubbles: true,
            composed: true,
            detail: {
                ...this.datosRegistro,
                correo,
                contrasenia,
                fotoPerfil
            }
        }));
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

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/registrar/registrar.component.css");
        console.log(link);
        shadow.appendChild(link);
    }
}