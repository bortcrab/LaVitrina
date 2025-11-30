import { RegistrarService } from '../../services/registrar.service.js';

export class RegistrarPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
            <registrar-usuario-info id="registroComponent"></registrar-usuario-info>
        `;
    }

    #agregarEventListeners(shadow) {
        const registroComponent = shadow.getElementById("registroComponent");

        if (!registroComponent) return;

        registroComponent.addEventListener('registro-submit', async (e) => {
            const datosRegistro = e.detail;

            if (registroComponent.toggleCarga) registroComponent.toggleCarga(true);
            if (registroComponent.mostrarError) registroComponent.mostrarError('');

            try {
                if (datosRegistro.foto) {
                    if (datosRegistro.foto.size > 5 * 1024 * 1024) { // 5MB
                        throw new Error("IMAGEN_GRANDE");
                    }
                }

                await RegistrarService.registrarUsuario(datosRegistro);

                this.#mostrarPantallaExito(shadow);

            } catch (error) {
                console.error('Error en registro:', error);

                let mensajeUsuario = "Ocurrió un problema al registrarte.";

                if (error.message === "IMAGEN_GRANDE") {
                    mensajeUsuario = "La imagen es muy pesada (Max 5MB).";
                    registroComponent.mostrarError(mensajeUsuario);
                } else if (error.message.includes("correo")) {
                    mensajeUsuario = "El correo ya está registrado.";
                    registroComponent.mostrarError(mensajeUsuario);
                } else if (error.message.includes("telefono")) {
                    mensajeUsuario = "Este número de teléfono ya está en uso.";
                    registroComponent.mostrarError(mensajeUsuario);
                } else if (error.message.includes("fetch") || error.message.includes("Network")) {
                    this.#mostrarPantallaError(shadow, "Sin conexión", "No pudimos conectar con el servidor.");
                }
                else {
                    registroComponent.mostrarError(mensajeUsuario);
                }

            } finally {
                const comp = shadow.getElementById("registroComponent");
                if (comp && comp.toggleCarga) comp.toggleCarga(false);
            }
        });
    }

    #mostrarPantallaExito(shadow) {
        shadow.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }
            </style>
            <exito-message-info 
                titulo="¡Bienvenido a La Vitrina!" 
                mensaje="Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y comenzar a vender o comprar."
                accion="Ir a Iniciar Sesión"
                id="exitoComp"
            ></exito-message-info>
        `;

        const exitoComp = shadow.getElementById('exitoComp');
        exitoComp.addEventListener('exito-click', () => {
            page('/iniciar-sesion');
        });
    }
    #mostrarPantallaError(shadow, titulo, mensaje) {
        shadow.innerHTML = `
             <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
            </style>
            <error-message-info 
                titulo="${titulo}" 
                mensaje="${mensaje}"
                accion="Intentar de nuevo"
                id="errorComp"
            ></error-message-info>
        `;

        const errorComp = shadow.getElementById('errorComp');
        errorComp.addEventListener('retry-click', () => {
            location.reload();
        });
    }


}