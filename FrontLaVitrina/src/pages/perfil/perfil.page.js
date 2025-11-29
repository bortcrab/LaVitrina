import { UsuariosService } from '../../services/usuario.service.js';

export class PerfilPage extends HTMLElement {
    constructor() {
        super();
        this.usuarioId = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            if (!usuarioStorage) throw new Error("No hay sesión activa");
            
            const usuarioSesion = JSON.parse(usuarioStorage);
            if (!usuarioSesion || !usuarioSesion.id) throw new Error("Datos de sesión inválidos");

            this.usuarioId = usuarioSesion.id;
            this.#render(shadow);
            this.#inicializarDatos(shadow);
            this.#agregarEventListeners(shadow);

        } catch (error) {
            console.warn("Error de sesión:", error.message);
            if(window.page) page('/iniciar-sesion');
        }
    }

    #render(shadow) {
        shadow.innerHTML = `
            <style>
                .error-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    text-align: center;
                    color: #666;
                    font-family: sans-serif;
                }
                .error-icon { font-size: 3rem; margin-bottom: 1rem; }
                .retry-btn {
                    margin-top: 1rem;
                    padding: 10px 20px;
                    background-color: #E62634;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
            <perfil-info id="perfilComponent"></perfil-info>
        `;
    }

    async #inicializarDatos(shadow) {
        const perfilComponent = shadow.getElementById('perfilComponent');
        
        try {
            const usuario = await UsuariosService.obtenerUsuarioPorId(this.usuarioId);

            if (perfilComponent) {
                perfilComponent.usuario = usuario; 
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            
            if(error.message === 'Sesión expirada') {
                alert("Tu sesión ha expirado, por favor ingresa nuevamente.");
                if(window.page) page('/iniciar-sesion');
                return;
            }

            if(perfilComponent) {
                shadow.innerHTML = `
                    <div class="error-container">
                        <h2>Hubo un problema al cargar el perfil, inténtalo de nuevo.</h2>
                        <p><small>${error.message}</small></p>
                        <button class="retry-btn" onclick="location.reload()">Reintentar</button>
                    </div>
                `;
            }
        }
    }

    #agregarEventListeners(shadow) {
        const perfilComponent = shadow.getElementById('perfilComponent');
        if(!perfilComponent) return;

        perfilComponent.addEventListener('guardar-cambios', async (e) => {
            const datosDelFormulario = e.detail;
            
            perfilComponent.setLoading(true);

            try {
                let urlFoto = undefined;

                if (datosDelFormulario.archivoFoto) {
                    try {
                        if (datosDelFormulario.archivoFoto.size > 5 * 1024 * 1024) {
                            throw new Error("La imagen es muy pesada, intenta subir una que pese menos de 5MB.");
                        }

                        console.log("Subiendo foto a Cloudinary...");
                        urlFoto = await UsuariosService.subirImagen(datosDelFormulario.archivoFoto);
                    } catch (error) {
                        alert(`Error con la imagen: ${error.message}`);
                        perfilComponent.setLoading(false);
                        return;
                    }
                }

                const datosParaBackend = {
                    ...datosDelFormulario,
                    fotoPerfil: urlFoto
                };
                delete datosParaBackend.archivoFoto;

                const usuarioActualizado = await UsuariosService.actualizarUsuario(this.usuarioId, datosParaBackend);
                
                perfilComponent.usuario = usuarioActualizado;
                
                const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
                if(usuarioSesion) {
                    usuarioSesion.nombres = usuarioActualizado.nombres;
                    localStorage.setItem('usuario', JSON.stringify(usuarioSesion));
                }

                alert('¡Perfil actualizado con éxito!');

            } catch (error) {
                console.error('Error al actualizar:', error);
                alert(`Hubo un error al guardar: ${error.message || 'Inténtalo de nuevo.'}`);
            } finally {
                perfilComponent.setLoading(false);
            }
        });

        perfilComponent.addEventListener('ver-resenias', (e) => {
            const datosUsuario = e.detail;
            datosUsuario.id = this.usuarioId;
            if(window.page) page('/resenias', datosUsuario);
        });
    }
}