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
        <nav class="side-bar">
            <div class="div-logo">
                <img src="./src/assets/logoRojo.png" alt="Logo La Vitrina" class="side-bar-logo">
            </div>
            <div class="div-buttons">
                <ul>
                    <li><a href="#" class="side-bar-button"><img src="./src/assets/inicioNegro.png" alt="Imagen inicio">Inicio</a></li>
                    <li><a href="#" class="side-bar-button"><img src="./src/assets/chatsNegro.png" alt="Imagen chats">Chats</a></li>
                    <li><a href="#" class="side-bar-button"><img src="./src/assets/misPublicacionesNegro.png" alt="Imagen mis publicaciones">Mis Publicaciones</a></li>
                </ul>
            </div>
            <div class="div-btn-publicar">
                <button class="side-bar-btn-publicar">Publicar</button>
            </div>
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