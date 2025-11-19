import { PostService } from '../../services/post.service.js';
import { UserService } from '../../services/user.service.js';

export class Post extends HTMLElement {
    #postService = new PostService();
    #userService = new UserService();
    constructor() {
        super();
    }

    connectedCallback() {
        const postId = this.getAttribute('postId');
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#consultarPost(postId, shadow);
    }

    #agregarEstilos(shadow) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '../src/components/post/post.component.css');
        shadow.appendChild(link);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <section>
            <h2><a href="#" id="titulo">...</a></h2>
            <p id="contenido">...</p>
            <p class="date">
                Publicado por <span id="usuario">...</span>
            </p>
        </section>
    `
    }

    #consultarPost(postId, shadow) {
        this.#postService.obtenerPost(postId)
            .then(post => {
                let element = shadow.querySelector('#titulo');
                element.innerHTML = post.title;
                element = shadow.querySelector('#contenido');
                element.innerHTML = post.body;
                this.#consultarUsuario(post.userId, shadow);
            })
    }

    #consultarUsuario(userId, shadow) {
        this.#userService.obtenerUsuario(userId)
            .then(user => {
                let element = shadow.querySelector('#usuario');
                element.innerHTML = user.name;
            });
    }
}