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
        shadow.innerHTML = `
            <iniciar-sesion-info id="loginComponent"></iniciar-sesion-info>
        `;
    }

    #agregarEventListeners(shadow) {
        const loginComponent = shadow.getElementById('loginComponent');

        loginComponent.addEventListener('login-submit', async (e) => {
            const { correo, contrasenia } = e.detail;

            loginComponent.toggleLoading(true);

            try {
                const datos = await IniciarSesionService.iniciarSesion(correo, contrasenia);

                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));

                const eventoLogin = new CustomEvent('loginSuccess', {
                    detail: { usuario: datos.usuario }, 
                    bubbles: true,
                    composed: true
                });

                
                window.dispatchEvent(eventoLogin);
                loginComponent.mostrarExito(`¡Bienvenido de nuevo, ${datos.usuario.nombres}!`);

                setTimeout(() => {
                    page('/home-page');
                }, 1000);

            } catch (error) {
                console.error("Error login:", error);
                loginComponent.mostrarError(error.message || 'Error al iniciar sesión');
                loginComponent.toggleLoading(false);
            }
        });
    }
}