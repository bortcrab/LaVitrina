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
        shadow.innerHTML = `<perfil-info id="perfilComponent"></perfil-info>`;
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
                this.#mostrarError(shadow, 
                    "Sesión expirada", 
                    "Tu sesión ha caducado, por favor ingresa nuevamente.", 
                    "Ir a Iniciar Sesión",
                    () => page('/iniciar-sesion')
                );
                return;
            }

            this.#mostrarError(shadow, 
                "No pudimos cargar el perfil", 
                ``, 
                "Intentar de nuevo",
                () => location.reload()
            );
        }
    }

    #mostrarError(shadow, titulo, mensaje, textoBoton, callback) {
        shadow.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 80vh; /* Centrado vertical */
                }
            </style>
            <error-message-info 
                titulo="${titulo}" 
                mensaje="${mensaje}"
                accion="${textoBoton}"
                id="errorComp"
            ></error-message-info>
        `;

        const errorComp = shadow.getElementById('errorComp');
        errorComp.addEventListener('retry-click', callback);
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
                    if (datosDelFormulario.archivoFoto.size > 5 * 1024 * 1024) {
                        throw new Error("IMAGEN_GRANDE");
                    }

                    console.log("Subiendo foto a Cloudinary...");
                    try {
                        urlFoto = await UsuariosService.subirImagen(datosDelFormulario.archivoFoto);
                    } catch (uploadError) {
                        throw new Error("ERROR_SUBIDA_IMAGEN");
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

                perfilComponent.finalizarEdicion();

            } catch (error) {
                console.error('Error al actualizar:', error);
                
                let titulo = "Ocurrió un problema inesperado. Por favor inténtalo de nuevo.";
                let mensaje = "Por favor inténtalo nuevamente.";

                if (error.message === "IMAGEN_GRANDE") {
                    titulo = "La imagen seleccionada pesa más de 5MB. Por favor elige una más ligera.";
                } else if (error.message === "ERROR_SUBIDA_IMAGEN") {
                    titulo = "No pudimos subir tu foto de perfil, inténtalo de nuevo.";
                } else if (error.message.includes("fetch") || error.message.includes("Network")) {
                    titulo = "Parece que no tienes internet o el servidor no responde, inténtalo de nuevo más tarde.";
                } else if (error.message.includes("correo")) {
                    titulo = "Este correo electrónico se encuentra en uso, ingresa uno diferente o inicia sesión.";
                } else if (error.message.includes("telefono")) {
                    titulo = "Este número de teléfono se encuentra en uso, ingresa uno diferente o inicia sesión.";
                }

                perfilComponent.mostrarError(titulo, mensaje);

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