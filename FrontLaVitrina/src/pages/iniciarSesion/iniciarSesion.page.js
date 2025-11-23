import { IniciarSesionService } from '../../services/iniciarSesion.service.js';

export class IniciarSesionPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#agregarEventListeners(shadow);
    }


    #render(shadow) {
        shadow.innerHTML += `
            <iniciar-sesion-info></iniciar-sesion-info>
        `;
    }


    #agregarEventListeners(shadow) {
        this.addEventListener('loginSubmit', (e) => {
            this.#handleLogin(e.detail, shadow);
        });
    }

    #handleLogin(datos, shadow) {
        const { correo, contrasenia } = datos;
        const resultado = IniciarSesionService.iniciarSesion(correo, contrasenia);

        if (resultado) {
            this.dispatchEvent(new CustomEvent('loginSuccess', {
                bubbles: true,
                composed: true,
                detail: { usuario: resultado }
            }));

            setTimeout(() => {
                page('/');
            }, 1000);
        }
        else {
            this.dispatchEvent(new CustomEvent('loginError', {
                bubbles: true,
                composed: true,
                detail: { mensaje: 'Correo o contraseña incorrectos' }
            }));
        }
    }


    
}