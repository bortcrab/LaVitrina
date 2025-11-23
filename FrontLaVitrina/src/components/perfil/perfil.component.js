import { PerfilService } from '../../services/perfil.service.js';

export class PerfilComponent extends HTMLElement {
    constructor() {
        super();
        this.usuario = null;
        this.editMode = false;
        this.editarRojoIconUrl = new URL('../../assets/editarRojo.png', import.meta.url).href;
        this.editarGrisIconUrl = new URL('../../assets/editarGris.png', import.meta.url).href;
        this.cssUrl = new URL('./perfil.component.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        
        await this.#cargarDatosUsuario();
        this.#render(shadow);
        this.#attachEventListeners(shadow);
    }

    async #cargarDatosUsuario() {
        try {
            this.usuario = await PerfilService.obtenerPerfil();
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            this.usuario = {}; 
        }
    }

    #render(shadow) {
        if (!this.usuario) return;

        shadow.innerHTML += `
            <div class="perfil-container">
                <div class="perfil-info">
                    <div class="usuario-avatar">
                        <img src="${this.usuario.avatar}" alt="Avatar" class="avatar-img" id="avatarImg">
                        <button class="editar-avatar" id="btnEditarAvatar">
                            <img src="${this.editarRojoIconUrl}" alt="Editar foto de perfil">
                        </button>
                        <input type="file" id="fileAvatar" accept="image/*" style="display: none;">
                    </div>
                    
                    <h2 class="usuario-nombre">${this.usuario.nombres} ${this.usuario.apellidoPaterno}</h2>
                    <p class="usuario-fecha">Perfil creado desde<br>${this.usuario.fechaCreacion}</p>
                    
                    <div class="reseñas-card">
                        <h3>Mi puntaje de reseñas</h3>
                        <div class="rating">
                            <span class="estrellas">★ ★ ★ ★ ★</span>
                            <span class="rating-numero">${this.usuario.rating}</span>
                        </div>
                        <p class="total-reseñas">Basado en ${this.usuario.totalReseñas} reseñas</p>
                        <a href="#" class="ver-reseñas">Ver todas las reseñas</a>
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
                                <input type="text" id="nombres" value="${this.usuario.nombres}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="apellidoPaterno">Apellido Paterno</label>
                                <input type="text" id="apellidoPaterno" value="${this.usuario.apellidoPaterno}" disabled>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="apellidoMaterno">Apellido Paterno</label>
                                <input type="text" id="apellidoMaterno" value="${this.usuario.apellidoMaterno}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="correo">Correo</label>
                                <input type="email" id="correo" value="${this.usuario.correo}" disabled>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="contraseña">Contraseña</label>
                                <input type="password" id="contraseña" value="****************" disabled>
                            </div>
                            <div class="form-group">
                                <label for="celular">Celular</label>
                                <input type="tel" id="celular" value="${this.usuario.celular}" disabled>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="fechaNacimiento">Fecha nacimiento</label>
                            <input type="text" id="fechaNacimiento" value="${this.usuario.fechaNacimiento}" disabled>
                        </div>

                        <button type="submit" class="btn-guardar" id="btnGuardar" style="display: none;">
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    #attachEventListeners(shadow) {
        const btnEditar = shadow.getElementById('btnEditar');
        const btnGuardar = shadow.getElementById('btnGuardar');
        const formPerfil = shadow.getElementById('formPerfil');
        const btnEditarAvatar = shadow.getElementById('btnEditarAvatar');
        const fileAvatar = shadow.getElementById('fileAvatar');
        const avatarImg = shadow.getElementById('avatarImg');

        if(btnEditar) {
            btnEditar.addEventListener('click', () => {
                this.editMode = !this.editMode;
                this.#toggleEditMode(shadow);
            });
        }

        if(formPerfil) {
            formPerfil.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.#guardarCambios(shadow);
            });
        }

        if(btnEditarAvatar && fileAvatar) {
            btnEditarAvatar.addEventListener('click', () => {
                fileAvatar.click();
            });

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
        const inputs = shadow.querySelectorAll('input:not(#fileAvatar)');
        const btnGuardar = shadow.getElementById('btnGuardar');

        inputs.forEach(input => {
            if (input.id !== 'fechaNacimiento') {
                input.disabled = !this.editMode;
            }
        });

        if(btnGuardar) btnGuardar.style.display = this.editMode ? 'block' : 'none';
    }

    async #guardarCambios(shadow) {
        const datosActualizados = {
            nombres: shadow.getElementById('nombres').value,
            apellidoPaterno: shadow.getElementById('apellidoPaterno').value,
            apellidoMaterno: shadow.getElementById('apellidoMaterno').value,
            correo: shadow.getElementById('correo').value,
            celular: shadow.getElementById('celular').value,
            contraseña: shadow.getElementById('contraseña').value !== '****************' 
                ? shadow.getElementById('contraseña').value 
                : undefined 
        };

        try {
            await PerfilService.actualizarPerfil(datosActualizados);
            
            alert('Perfil actualizado correctamente');
            this.editMode = false;
            this.#toggleEditMode(shadow);
            
            await this.#cargarDatosUsuario();
            
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Error al guardar los cambios');
        }
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}