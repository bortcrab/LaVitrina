export class IniciarSesionComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <div class="all">
    <div class="image-side side-div">
        <img src="./src/assets/iniciarSesion.png" alt="Gente empacando">

        <div class="overlay"></div>

        <div class="content-over-image">
            <div class="logo-container">
                <img class="brand-logo" src="../../assets/logoBlanco.png" alt="">
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


            <form>
                <div class="input-group">
                    <label>Correo electrónico</label>
                    <input type="email" placeholder="ejemplo@direccion.com">
                </div>

                <div class="input-group">
                    <div class="label-row">
                        <label>Contraseña</label>
                        <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input type="password" placeholder="********">
                </div>

                <button type="submit">Entrar</button>
            </form>

            <p class="register-text">
                ¿Aún no tienes una cuenta?
                <a href="#" class="registrarse">Regístrate</a>
            </p>
        </div>
    </div>
    </div>
        `
    };

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/iniciarSesion/iniciarSesion.component.css");
        shadow.appendChild(link);
    }
}