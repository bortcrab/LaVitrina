export class SidebarComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#agregaEstilo(shadow);
        this.#render(shadow);
        this.#attachEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <nav class="side-bar">
            <div class="container">
                <div class="div-logo">
                    <img src="./src/assets/logoRojo.png" alt="Logo La Vitrina" class="side-bar-logo">
                </div>
                <div class="div-buttons">
                    <ul>
                        <li>
                            <a href="#" class="side-bar-button" data-route="/home-page">
                                <img src="./src/assets/inicioNegro.png" alt="Imagen inicio">Inicio
                            </a>
                        </li>
                        <li>
                            <a href="#" class="side-bar-button" data-route="/chats">
                                <img src="./src/assets/chatsNegro.png" alt="Imagen chats">Chats
                            </a>
                        </li>
                        <li>
                            <a href="#" class="side-bar-button" data-route="/perfil"> <img src="./src/assets/misPublicacionesNegro.png" alt="Imagen mis publicaciones">Mis Publicaciones
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="div-btn-publicar">
                <button class="side-bar-btn-publicar" id="btnPublicar">Publicar</button>
            </div>
        </nav>
		`;
    }

    #attachEventListeners(shadow) {
        const links = shadow.querySelectorAll('a[data-route]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                page(route);
            });
        });

        const btnPublicar = shadow.getElementById('btnPublicar');
        if (btnPublicar) {
            btnPublicar.addEventListener('click', () => {
                page('/crear-publicacion');
            });
        }
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/side-bar/sidebar.component.css");
        shadow.appendChild(link);
    }
}