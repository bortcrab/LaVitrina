import { IniciarSesionService } from '../../services/iniciarSesion.service.js'

export class IniciarSesionComponent extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./iniciarSesion.component.css', import.meta.url).href;
        this.iniciarSesionUrl = new URL('../../assets/iniciarSesion.png', import.meta.url).href;
        this.logoBlancoURL = new URL('../../assets/logoBlanco.png', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <div class="all">
    <div class="image-side side-div">
        <img src="${this.iniciarSesionUrl}" alt="Gente empacando">

        <div class="overlay"></div>

        <div class="content-over-image">
            <div class="logo-container">
                <img class="brand-logo" src="${this.logoBlancoURL}">
            </div>
            <h2 class="brand-slogan">El Marketplace Donde Encontrarás<br>Todo lo que Necesitas.</h2>
        </div>
    </div>

    <div class="login-form side-div">
        <div class="form-container">
            <div class="header">
                <h3>¡Qué gusto tenerte de vuelta!</h3>
                <span class="subtitle">Inicia sesión con tu cuenta.</span>
            </div>


            <form id="formIniciarSesion" >
                <div class="input-group">
                    <label>Correo electrónico</label>
                    <input type="email"name="email" autocomplete="username" maxlength="100" id="correo" placeholder="ejemplo@direccion.com">
                </div>

                <div class="input-group">
                    <div class="label-row">
                        <label>Contraseña</label>
                        <a href="#" class="forgot-link" id="olvidoContrasenia">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input type="password" name="password" autocomplete="current-password" maxlength="30" id="contrasenia" placeholder="********">
                </div>

                <div class="error-message" id="errorMessage"></div>
                <div class="success-message" id="successMessage"></div>


                <button type="submit">Entrar</button>

                 
            </form>

            <p class="register-text">
                ¿Aún no tienes una cuenta?
                <a href="#" class="registrarse" id="linkRegistrarse">Regístrate</a>
            </p>
        </div>
    </div>
    </div>
        `
    };

    #agregarEventListeners(shadow) {
        const form = shadow.getElementById('formIniciarSesion');
        const olvidoContrasenia = shadow.getElementById('olvidoContrasenia');
        const errorMessage = shadow.getElementById('errorMessage');
        const successMessage = shadow.getElementById('successMessage');
        const linkRegistrarse = shadow.getElementById('linkRegistrarse');
        const inputCorreo = shadow.getElementById('correo');

        inputCorreo.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
            }
        });

        inputCorreo.addEventListener('blur', (e) => {
            e.target.value = e.target.value.replace(/\s/g, '');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();


            const correo = shadow.getElementById('correo').value.trim();
            const contrasenia = shadow.getElementById('contrasenia').value;

            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            if (!correo || !contrasenia) {
                errorMessage.textContent = 'Por favor completa todos los campos';
                errorMessage.style.display = 'block';
                return;
            }

            try {
                const datos = await IniciarSesionService.iniciarSesion(correo, contrasenia);

                console.log("Login exitoso, respuesta del server:", datos);

                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));

                successMessage.textContent = `¡Bienvenido de nuevo, ${datos.usuario.nombres}!`;
                successMessage.style.display = 'block';

                window.location.href = "/home-page"
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }


        });

        linkRegistrarse.addEventListener('click', (e) => {
            e.preventDefault();
            page('/registrar');
        });

        olvidoContrasenia.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Funcionalidad de recuperación de contraseña próximamente');
        });

        window.addEventListener('loginSuccess', (e) => {
            successMessage.textContent = `¡Bienvenido de nuevo, ${e.detail.usuario.nombres}!`;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        });

        window.addEventListener('loginError', (e) => {
            errorMessage.textContent = e.detail.mensaje;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        });
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}