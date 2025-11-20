export class RegistrarUsuarioComponent extends HTMLElement {
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
        <div class="login-form side-div">
            <div class="form-container">
                <div class="header">
                    <h3>¡Crea tu cuenta!</h3>
                    <span class="subtitle">Ingresa la información solicitada.</span>
                </div>

                <form>
                    <div class="input-group">
                        <label>Nombre</label>
                        <input type="text" placeholder="Nombres" required>
                    </div>

                    <div class="input-row">
                        <div class="input-group half">
                            <input type="text" placeholder="Apellido paterno" required>
                        </div>
                        <div class="input-group half">
                            <input type="text" placeholder="Apellido materno" required>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-group half">
                            <label>Ciudad</label>
                            <select required>
                                <option value="" disabled selected>Seleccione</option>
                                <option value="cdmx">Ciudad de México</option>
                                <option value="guadalajara">Guadalajara</option>
                                <option value="monterrey">Monterrey</option>
                            </select>
                        </div>
                        <div class="input-group half">
                            <label>Fecha de nacimiento</label>
                            <input type="date" required>
                        </div>
                    </div>

                    <div class="input-group">
                        <label>Número de celular</label>
                        <input type="text" placeholder="###-###-####" required>
                    </div>

                    <button type="submit">Siguiente</button>
                </form>

                <p class="register-text">
                    ¿Ya tienes una cuenta?
                    <a href="#" class="registrarse">Inicia sesión</a>
                </p>
            </div>
        </div>

        <div class="image-side side-div">
            <img src="./src/assets/registrar.png" alt="Familia en casa">

            <div class="overlay"></div>

            <div class="content-over-image">
                <div class="logo-container">
                    <img class="brand-logo" src="./src/assets/logoBlanco.png" alt="La Vitrina">
                </div>
                <h2 class="brand-slogan">Tú Página de Compras y Ventas en<br>Línea de Confianza.</h2>
            </div>
        </div>
    </div>
        `
    };

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/registrar/registrar.component.css");
        shadow.appendChild(link);
    }
}