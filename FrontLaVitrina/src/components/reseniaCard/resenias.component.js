export class ReseniaCardComponent extends HTMLElement {

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
            <div class="resenia-info">
                <div class="resenia-left-data">
                    <img src="../../assets/rata.jpeg" alt="">
                    <div class="resenia-data">
                        <h3 id="titulo">Muy mal sabor de boca</h3>
                        <h5 id="usuario">Mayonesa Hellmann's</h5>
                        <span id="calificacion" class="estrellas">★ ★ ★ ★ ★</span>
                    </div>
                </div>
                <h5>Hace <span id="dias">10</span> días</h5>
            </div>
            <p id="descripcion">Recomiendo al 100% sus productos. Hasta me promociona gratis. Volvería a comprar sin duda.</p>
        </div>
		`;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/reseniaCart/reseniacard.component.css");
        shadow.appendChild(link);
    }
}