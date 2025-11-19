export class SidebarComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#agregaEstilo(shadow);
        this.#render(shadow);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <nav>
            <img src="./src/assets/logoRojo.png" alt="Logo La Vitrina">
            <ul class="side-bar-buttons">
                <li><a href="#"><img src="./src/assets/inicioNegro.png" alt="">Inicio</a></li>
                <li><a href="#"><img src="./src/assets/chatsNegro.png" alt="">Chats</a></li>
                <li><a href="#"><img src="./src/assets/misPublicacionesNegro.png" alt="">Mis Publicaciones</a></li>
            </ul>
            <button class="side-bar-publicar">Publicar</button>
        </nav>
		`;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/side-bar/sidebar.component.css");
        shadow.appendChild(link);
    }
}