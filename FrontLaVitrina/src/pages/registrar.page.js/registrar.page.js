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

                let tituloError = "Error de Registro";
                let mensajeUsuario = error.message; 

                if (error.message === "IMAGEN_GRANDE") {
                    registroComponent.mostrarError("La imagen es muy pesada (Max 5MB).");
                    return;
                }

                if (error.message.includes("correo") || error.message.includes("registrado")) {
                    registroComponent.mostrarError(mensajeUsuario);
                    return;
                }

                this.#mostrarPantallaError(shadow, tituloError, mensajeUsuario);
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