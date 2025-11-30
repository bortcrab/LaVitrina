import { PublicacionService } from "../../services/publicacion.service.js";
import { ChatService } from "../../services/chat.service.js";

export class DetallePublicacionPage extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./detallepublicacion.page.css', import.meta.url).href;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const id = this.getAttribute('id');
    
        const publicacion = await PublicacionService.obtenerPublicacion(id);
        const datosFecha = publicacion.fechaPublicacion.split('-');
        publicacion.fechaPublicacion = datosFecha[0] + '/' + datosFecha[1] + '/' + datosFecha[2];

        this.#agregaEstilo(shadow);
        
        if (publicacion) {
            this.#render(shadow, publicacion);
        } else {
            shadow.innerHTML = "<h2>publicacion no encontrada.</h2>";
        }
        this.#agregarEventListeners(shadow);
    }

    #render(shadow, publicacion) {
        shadow.innerHTML += `
            <div class="container">
                <div class="izquierda">
                    <div class="publicacion-container">
                        <h2 id="titulo">${publicacion.titulo}</h2>
                        <div class="disponibilidad-fecha">
                            <h3 id="disponibilidad">${publicacion.estado}</h3>
                            <h4 id="fechaPublicacion">${publicacion.fechaPublicacion}</h4>
                        </div>
                        <img src="${publicacion.imagen}" alt="">
                        <div class="descripcion-info">
                            <h3>Descripción</h3>
                            <h3 id="precio">$ ${publicacion.precio}.00</h3>
                        </div>
                        <p id="descripcion">
                            ${publicacion.descripcion}
                        </p>
                    </div>
                </div>
                <div class="derecha">
                    ${publicacion.estado === 'Subasta' ? '<subasta-card-info></subasta-card-info>' : ''}
                    <div class="mensaje-container">
                        <div class="perfil-info">
                            <img class="profile-pic" src="${publicacion.usuario.fotoPerfil}" alt="">
                            <div class="user-data">
                                <h3 id="nombre-perfil">${publicacion.usuario.nombres}</h3>
                                <div class="resenias">
                                    <h5 id="calificacion"><span class="estrella">★</span>${publicacion.usuario.puntuacion} (1,204 reseñas)</h5>
                                </div>
                            </div>
                        </div>
                        <hr class="line">
                        <div class="button">
                            <button id="btn-enviar-mensaje">Enviar mensaje</button>
                        </div>
                    </div>
                </div>
            </div>
		`;
    }

    #agregarEventListeners(shadow) {
        const btnEnviarMensaje = shadow.getElementById('btn-enviar-mensaje');
        const idPublicacion = this.getAttribute('id');

        if(btnEnviarMensaje){
            btnEnviarMensaje.addEventListener('click', async (e) => {
                e.preventDefault();
                
                btnEnviarMensaje.disabled = true;
                btnEnviarMensaje.textContent = "Iniciando chat...";

                try {
                    const chat = await ChatService.crearChat(idPublicacion);
                    localStorage.setItem('chatAbiertoId', chat.id); 
                    
                    page("/chats");
                } catch (error) {
                    console.error(error);
                    alert("No se pudo iniciar el chat. Intenta iniciar sesión nuevamente.");
                    btnEnviarMensaje.disabled = false;
                    btnEnviarMensaje.textContent = "Enviar mensaje";
                }
            });
        }
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }
}