export class ImagenItem extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./imagenItem.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const idImagen = this.getAttribute('id');
        const rutaImagen = this.getAttribute('rutaImagen');
        const imagenAnterior = this.getAttribute('imagenAnterior')
        const imagenSiguiente = this.getAttribute('imagenSiguiente');

        const imagenData = { idImagen, rutaImagen, imagenAnterior, imagenSiguiente }

        this.#render(shadow, imagenData);
        this.#agregarEstilos(shadow);
        this.#agregarIconos(shadow);
    }

    #render(shadow, imagenData) {
        shadow.innerHTML += `
            <div class="itemCarrusel" id="${imagenData.idImagen}">
                <div class="tarjetaCarrusel" id="tarjetaCarrusel-1">
                    <img src="${imagenData.rutaImagen}" alt="imagen">
                </div>
            </div>
        `;
    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }

    #agregarIconos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");
        shadow.appendChild(link);
    }

}