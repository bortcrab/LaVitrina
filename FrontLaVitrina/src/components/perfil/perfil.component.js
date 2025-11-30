export class PerfilComponent extends HTMLElement {
    #usuario = null;
    #archivoSeleccionado = null;

    constructor() {
        super();
        this.editMode = false;
        this.editarRojoIconUrl = new URL('../../assets/editarRojo.png', import.meta.url).href;
        this.editarGrisIconUrl = new URL('../../assets/editarGris.png', import.meta.url).href;
        this.cssUrl = new URL('./perfil.component.css', import.meta.url).href;
    }

    set usuario(data) {
        this.#usuario = data;
        this.#archivoSeleccionado = null;
        this.render();
    }

    setLoading(isLoading) {
        const btnGuardar = this.shadowRoot.getElementById('btnGuardar');
        if (btnGuardar) {
            btnGuardar.disabled = isLoading;
            btnGuardar.textContent = isLoading ? "Guardando..." : "Guardar cambios";
            btnGuardar.style.backgroundColor = isLoading ? "#999" : "#E62634";
        }
    }

    finalizarEdicion() {
        if (this.editMode) {
            this.editMode = false;
            this.#toggleEditMode(this.shadowRoot);
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.render(); 
    }

    render() {
        const shadow = this.shadowRoot;
        if (!this.#usuario) {
            shadow.innerHTML = '<div style="padding:20px; text-align:center;">Cargando perfil...</div>'; 
            return;
        }

        shadow.innerHTML = `
            <div class="modal-overlay" id="modalError" style="display: none;">
                <error-message-info 
                    id="componenteError"
                    titulo="Atención" 
                    mensaje="" 
                    accion="Entendido">
                </error-message-info>
            </div>

            <div class="perfil-container">
                <div class="perfil-info">
                    <div class="usuario-avatar">
                        <img src="${this.#usuario.avatar}" alt="Avatar" class="avatar-img" id="avatarImg">
                        
                        <button class="editar-avatar" id="btnEditarAvatar">
                            <img src="${this.editarRojoIconUrl}" alt="Editar foto">
                        </button>
                        <input type="file" id="fileAvatar" accept="image/*" style="display: none;">
                    </div>
                    
                    <h2 class="usuario-nombre">${this.#usuario.nombres} ${this.#usuario.apellidoPaterno}</h2>
                    <p class="usuario-fecha">Perfil creado desde<br>${this.#usuario.fechaCreacion}</p>
                    
                    <div class="reseñas-card">
                        <h3>Mi puntaje de reseñas</h3>
                        <div class="rating">
                            <span class="estrellas">★ ★ ★ ★ ★</span>
                            <span class="rating-numero">${this.#usuario.rating}</span>
                        </div>
                        <p class="total-reseñas">Basado en ${this.#usuario.totalReseñas} reseñas</p>
                        <a href="#" class="ver-reseñas" id="verResenias">Ver todas las reseñas</a>
                    </div>
                </div>

                <div class="perfil-datos">
                    <div class="perfil-header">
                        <h2>Datos de perfil</h2>
                        <button class="btn-editar" id="btnEditar" title="Editar perfil">
                            <img src="${this.editarGrisIconUrl}" alt="Editar perfil">
                        </button>
                    </div>

                    <form class="formulario-perfil" id="formPerfil">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="nombres">Nombres</label>
                                <input type="text" id="nombres" value="${this.#usuario.nombres}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="apellidoPaterno">Apellido Paterno</label>
                                <input type="text" id="apellidoPaterno" value="${this.#usuario.apellidoPaterno}" disabled>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="apellidoMaterno">Apellido Materno</label>
                                <input type="text" id="apellidoMaterno" value="${this.#usuario.apellidoMaterno}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="correo">Correo</label>
                                <input type="email" id="correo" value="${this.#usuario.correo}" disabled>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contraseña">Contraseña</label>
                                <input type="password" id="contraseña" disabled placeholder="••••••••">
                            </div>
                            <div class="form-group">
                                <label for="telefono">Teléfono</label>
                                <input type="tel" id="telefono" value="${this.#usuario.telefono}" disabled>
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label for="fechaNacimiento">Fecha nacimiento</label>
                            <input type="text" id="fechaNacimiento" value="${this.#usuario.fechaNacimiento}" disabled>
                        </div>

                        <button type="submit" class="btn-guardar" id="btnGuardar" style="display: none;">
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        this.#agregarEstilos(shadow);
        this.#attachEventListeners(shadow);
        
        if(this.editMode) this.#toggleEditMode(shadow);
    }

    mostrarError(mensaje, inputAFocusear = null) {
        const modal = this.shadowRoot.getElementById('modalError');
        const componenteError = this.shadowRoot.getElementById('componenteError');
        
        if (componenteError) componenteError.setAttribute('mensaje', mensaje);
        
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10);
        }

        const cerrar = () => {
            modal.classList.remove('visible');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            componenteError.removeEventListener('retry-click', cerrar);
            if(inputAFocusear) inputAFocusear.focus();
        };

        componenteError.addEventListener('retry-click', cerrar);
    }

    #attachEventListeners(shadow) {
        const btnEditar = shadow.getElementById('btnEditar');
        const formPerfil = shadow.getElementById('formPerfil');
        const btnEditarAvatar = shadow.getElementById('btnEditarAvatar');
        const fileAvatar = shadow.getElementById('fileAvatar');
        const avatarImg = shadow.getElementById('avatarImg');
        const verResenias = shadow.getElementById('verResenias');

        if(btnEditar) {
            btnEditar.addEventListener('click', (e) => {
                e.preventDefault();
                this.editMode = !this.editMode;
                this.#toggleEditMode(shadow);
            });
        }

        if(verResenias) {
            verResenias.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('ver-resenias', {
                    bubbles: true,
                    composed: true,
                    detail: { id: this.#usuario.id }
                }));
            });
        }

        if(formPerfil) {
            formPerfil.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const inputsRequeridos = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'fechaNacimiento'];
                for (const id of inputsRequeridos) {
                    const input = shadow.getElementById(id);
                    if (!input.value.trim()) {
                        this.mostrarError(`Llena todos los datos antes de continuar.`, input);
                        return;
                    }
                }

                const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                const inputsTexto = ['nombres', 'apellidoPaterno', 'apellidoMaterno'];
                for (const id of inputsTexto) {
                    const input = shadow.getElementById(id);
                    if (!soloLetrasRegex.test(input.value.trim())) {
                        this.mostrarError(`Los nombres y apellidos solo deben contener letras y espacios.`, input);
                        return;
                    }
                }

                const correoInput = shadow.getElementById('correo');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(correoInput.value.trim())) {
                    this.mostrarError("El formato del correo electrónico no es válido.", correoInput);
                    return;
                }

                const telefonoInput = shadow.getElementById('telefono');
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(telefonoInput.value.trim())) {
                    this.mostrarError("El teléfono debe tener exactamente 10 dígitos numéricos.", telefonoInput);
                    return;
                }

                const passInput = shadow.getElementById('contraseña');
                const passValue = passInput.value;
                
                if (passValue.trim() !== '') {
                    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                    if (!passRegex.test(passValue)) {
                        this.mostrarError("La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y un caracter especial.", passInput);
                        return;
                    }
                }

                this.#emitirGuardado(shadow);
            });
        }

        if(btnEditarAvatar && fileAvatar) {
            btnEditarAvatar.addEventListener('click', () => fileAvatar.click());
            
            fileAvatar.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.#archivoSeleccionado = file;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if(avatarImg) avatarImg.src = event.target.result;
                        if(!this.editMode) {
                            this.editMode = true;
                            this.#toggleEditMode(shadow);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    #toggleEditMode(shadow) {
        const inputs = shadow.querySelectorAll('input:not(#fileAvatar):not(#fechaNacimiento)');
        const btnGuardar = shadow.getElementById('btnGuardar');
        inputs.forEach(input => input.disabled = !this.editMode);
        if(btnGuardar) btnGuardar.style.display = this.editMode ? 'block' : 'none';
    }

    #emitirGuardado(shadow) {
        const passInput = shadow.getElementById('contraseña');
        let passValue = passInput.value.trim();
        
        if (passValue === '****************' || passValue === '') {
            passValue = undefined;
        }

        const datos = {
            nombres: shadow.getElementById('nombres').value,
            apellidoPaterno: shadow.getElementById('apellidoPaterno').value,
            apellidoMaterno: shadow.getElementById('apellidoMaterno').value,
            correo: shadow.getElementById('correo').value,
            telefono: shadow.getElementById('telefono').value,
            contrasenia: passValue,
            archivoFoto: this.#archivoSeleccionado 
        };

        Object.keys(datos).forEach(key => datos[key] === undefined && delete datos[key]);
        
        this.dispatchEvent(new CustomEvent('guardar-cambios', {
            detail: datos,
            bubbles: true,
            composed: true
        }));
    }

    #agregarEstilos(shadow) {
        if(!shadow.querySelector('link')) {
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.cssUrl);
            shadow.appendChild(link);
        }
    }
}