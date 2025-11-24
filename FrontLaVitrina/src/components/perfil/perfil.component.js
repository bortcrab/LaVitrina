export class PerfilComponent extends HTMLElement {
    #usuario = null;

    constructor() {
        super();
        this.editMode = false;
        this.editarRojoIconUrl = new URL('../../assets/editarRojo.png', import.meta.url).href;
        this.editarGrisIconUrl = new URL('../../assets/editarGris.png', import.meta.url).href;
        this.cssUrl = new URL('./perfil.component.css', import.meta.url).href;
    }

    set usuario(data) {
        this.#usuario = data;
        this.render();
    }

    get usuario() {
        return this.#usuario;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.render(); 
    }

    render() {
        const shadow = this.shadowRoot;
        if (!this.#usuario) {
            shadow.innerHTML = '<div class="loading">Cargando perfil...</div>'; 
            return;
        }

        shadow.innerHTML = `
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
                                <input type="password" id="contraseña" value="****************" disabled>
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
                    detail: {
                        nombres: `${this.#usuario.nombres} ${this.#usuario.apellidoPaterno}`,
                        puntuacion: this.#usuario.rating,
                        fotoPerfil: this.#usuario.avatar || this.#usuario.fotoPerfil
                    }
                }));
            });
        }

        if(formPerfil) {
            formPerfil.addEventListener('submit', (e) => {
                e.preventDefault();
                this.#emitirGuardado(shadow);
            });
        }

        if(btnEditarAvatar && fileAvatar) {
            btnEditarAvatar.addEventListener('click', () => fileAvatar.click());
            fileAvatar.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if(avatarImg) avatarImg.src = event.target.result;
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
        const datos = {
            nombres: shadow.getElementById('nombres').value,
            apellidoPaterno: shadow.getElementById('apellidoPaterno').value,
            apellidoMaterno: shadow.getElementById('apellidoMaterno').value,
            correo: shadow.getElementById('correo').value,
            telefono: shadow.getElementById('telefono').value,
            contrasenia: shadow.getElementById('contraseña').value !== '****************' 
                ? shadow.getElementById('contraseña').value 
                : undefined 
        };

        if (datos.contrasenia === undefined) delete datos.contrasenia;

        this.editMode = false;
        
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