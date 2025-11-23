export class ReseniasComponent extends HTMLElement {

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
        <div class="container">
            <div class="top-info">
                <div class="user">
                    <img src="../../assets/pedrito.png" alt="">
                    <div class="user-info">
                        <h1 id="username">Reseñas de Pedro</h1>
                        <p>Observa lo que dicen los demás de <span id="name">Pedro</span></p>
                        <h5 id="calificacion"><span class="estrella">★</span>4.9</h5>
                    </div>
                </div>
                <button class="btn-escribir-resenia">Escribir reseña<span class="pencil">✎</span></button>
            </div>
            <div class="middle-info">
                <h2>108 Reseñas</h2>
                <div class="filtro-info">
                    <h2>Ordenar por:</h2>
                    <select name="filtro" id="filtro">
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                    </select>
                </div>
            </div>
        </div>
		`;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/resenias/resenias.component.css");
        shadow.appendChild(link);
    }
}