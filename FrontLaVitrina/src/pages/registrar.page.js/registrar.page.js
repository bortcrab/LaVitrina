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
            <registrar-usuario-info></registrar-usuario-info>
        `;
    }

    #agregarEventListeners(shadow) {
        this.addEventListener('registroSubmit', (e) => {
            this.#handleRegistro(e.detail);
        });
    }

    #handleRegistro(datos) {
        const resultado = RegistrarService.registrarUsuario(datos);

        if (resultado.exito) {
            window.dispatchEvent(new CustomEvent('registroSuccess', {
                detail: { 
                    mensaje: '¡Cuenta creada exitosamente!',
                    usuario: resultado.usuario 
                }
            }));

            setTimeout(() => {
                page('/iniciar-sesion');
            }, 2000);
        } else {
            window.dispatchEvent(new CustomEvent('registroError', {
                detail: { mensaje: resultado.mensaje }
            }));
        }
    }
}