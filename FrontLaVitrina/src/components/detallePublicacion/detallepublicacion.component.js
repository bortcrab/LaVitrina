export class DetallePublicacionComponent extends HTMLElement {

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
                <div class="publicacion-container">
                    <h2 id="titulo">iPhone 11 en muy buen estado</h2>
                    <h3 id="disponibilidad">Artículo disponible</h3>
                    <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop" alt="">
                    <div class="descripcion-info">
                        <h3>Descripción</h3>
                        <h3 id="precio">$ 5,000.00</h3>
                    </div>
                    <p id="descripcion">
                        Vendo iPhone 11 con todos sus accesorios 📱 <br>
                        ✅ Cargador <br>
                        ✅ Audífonos <br>
                        ✅ Case protector <br>
                        <br>
                        La batería tiene 93% de condición, he cuidado muy bien el teléfono.
                    </p>
                </div>
                <div class="mensaje-container">
                    <div class="perfil-info">
                        <img class="profile-pic" src="FrontLaVitrina/src/assets/pedrito.png" alt="">
                        <div class="user-data">
                            <h3 id="nombre-perfil">Finn, The Human</h3>
                            <div class="resenias">
                                <h5 id="calificacion"><span class="estrella">★</span>4.9 (1,204 reseñas)</h5>
                            </div>
                        </div>
                    </div>
                    <hr class="line">
                    <div class="button">
                        <button id="btn-enviar-mensaje">Enviar mensaje</button>
                    </div>
                </div>
            </div>
		`;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/detallePublicacion/detallepublicacion.component.css");
        shadow.appendChild(link);
    }
}