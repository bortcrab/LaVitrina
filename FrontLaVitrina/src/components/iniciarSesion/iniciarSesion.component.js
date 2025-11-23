export class IniciarSesionComponent extends HTMLElement {
    constructor() {
        super();
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
        <img src="./src/assets/iniciarSesion.png" alt="Gente empacando">

        <div class="overlay"></div>

        <div class="content-over-image">
            <div class="logo-container">
                <img class="brand-logo" src="./src/assets/logoBlanco.png" alt="">
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
                    <input type="email" id="correo" placeholder="ejemplo@direccion.com">
                </div>

                <div class="input-group">
                    <div class="label-row">
                        <label>Contraseña</label>
                        <a href="#" class="forgot-link" id="olvidoContrasenia">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input type="password" id="contrasenia" placeholder="********">
                </div>

                <div class="error-message" id="errorMessage"></div>
                <div class="success-message" id="successMessage"></div>


                <a href="/home-page"><button type="submit">Entrar</button></a>
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

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const correo = shadow.getElementById('correo').value.trim();
            const contrasenia = shadow.getElementById('contrasenia').value;

            if (!correo || !contrasenia) {
                errorMessage.textContent = 'Por favor completa todos los campos';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                return;
            }
            window.addEventListener('loginSuccess', (e) => {
            // 1. Mostrar el mensaje de éxito
            successMessage.textContent = `¡Bienvenido de nuevo, ${e.detail.usuario.nombres}!`;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // 2. Redirigir al home después de 1.5 segundos
            setTimeout(() => {
                page('/home-page'); // <--- ESTO HACE LA REDIRECCIÓN
            }, 1500);
        });

            this.dispatchEvent(new CustomEvent('loginSubmit', {
                bubbles: true,
                composed: true,
                detail: { correo, contrasenia }
            }));
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
        link.setAttribute("href", "./src/components/iniciarSesion/iniciarSesion.component.css");
        shadow.appendChild(link);
    }
}