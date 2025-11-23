export class HeaderComponent extends HTMLElement {
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
        <header class="main-header">
                <div class="search-bar">
                    <input class="search-input" placeholder="Buscar productos, servicios..." type="text">
                    <img class="search-icon" src="./src/assets/buscar.png" alt="icono buscar">
                </div>

                <div class="user-info" id="userInfo" style="cursor: pointer;">
                    <span class="user-name">Juanito</span>
                    <img src="https://i.pravatar.cc/150?img=5" alt="Perfil" class="user-avatar">
                </div>
        </header>
        `
        
        const userInfo = shadow.getElementById('userInfo');
        if (userInfo) {
            userInfo.addEventListener('click', () => {
                page('/perfil');
            });
        }
    };

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/header/header.css");
        shadow.appendChild(link);
    }
}