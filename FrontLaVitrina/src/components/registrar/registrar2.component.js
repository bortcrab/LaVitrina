export class RegistrarUsuario2Component extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./registrar2.component.css', import.meta.url).href;
        this.logoBlancoURL = new URL('../../assets/logoBlanco.png', import.meta.url).href;
        this.registrarURL = new URL('../../assets/registrar.png', import.meta.url).href;
        this.registrar2URL = new URL('../../assets/registrar2.png', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <div class="login-form side-div">
        <div class="form-container">
            <div class="header">
                <h3>¡Crea tu cuenta!</h3>
                <span class="subtitle">Ya casi terminamos...</span>
            </div>

            <form>
                <div class="input-group input-foto">
                    <label>Foto de perfil</label>
                    <div class="photo-upload">
                        <input type="file" id="photoInput" accept="image/*" style="display: none;">
                        <label for="photoInput" class="photo-label">
                            <div class="photo-placeholder">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 8V32M8 20H32" stroke="#999" stroke-width="3" stroke-linecap="round" />
                                </svg>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="input-group">
                    <label>Correo electrónico</label>
                    <input type="email" placeholder="ejemplo@direccion.com" required>
                </div>

                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" placeholder="********" required>
                </div>

                <div class="input-group">
                    <label>Confirmar contraseña</label>
                    <input type="password" placeholder="********" required>
                </div>

                <button type="submit">Crear cuenta</button>
            </form>

            <p class="register-text">
                ¿Ya tienes una cuenta?
                <a href="#" class="registrarse">Inicia sesión</a>
            </p>
        </div>
    </div>

    <div class="image-side side-div">
        <img src="${this.registrar2URL}" alt="Productos en línea">

        <div class="overlay"></div>

        <div class="content-over-image">
            <div class="logo-container">
                <img class="brand-logo" src="${this.logoBlancoURL}" alt="La Vitrina">
            </div>
            <h2 class="brand-slogan">Vender Productos en Línea Nunca<br>Había Sido Tan Fácil.</h2>
        </div>
    </div>
        `
    };

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}