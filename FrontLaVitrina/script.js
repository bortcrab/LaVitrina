import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { IniciarSesionComponent } from './src/components/iniciarSesion/iniciarSesion.component.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";
import { HomePage } from './src/pages/home/home.page.js';
import { PerfilComponent } from './src/components/perfil/perfil.component.js';
import { ChatsComponent } from './src/components/chats/chats.component.js';
import { ReseniasComponent } from "./src/components/resenias/resenias.component.js";
import { DetallePublicacionComponent } from "./src/components/detallePublicacion/detallepublicacion.component.js";

window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent);
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
window.customElements.define('product-info', PublicacionComponent);
window.customElements.define('home-page', HomePage);
window.customElements.define('perfil-info', PerfilComponent);
window.customElements.define('chats-info', ChatsComponent);
window.customElements.define('resenias-info', ReseniasComponent);
window.customElements.define('detalle-publicacion-info', DetallePublicacionComponent);

document.addEventListener('DOMContentLoaded', function(){
    
    page('/home-page', () => {
        toggleNav(true); 
        showContent('home-page');
    });
    
    page('/perfil', () => {
        toggleNav(true);
        showContent('perfil-info');
    });

    page('/chats', () => {
        toggleNav(true);
        showContent('chats-info');
    });

    page('/crear-publicacion', () => {
        toggleNav(true);
        showContent('crear-publicacion');
    });

    page('*', () => {
        toggleNav(false);
        showContent('iniciar-sesion-info');
    });

    page();
});

function showContent(contentId) {
    document.querySelector('.derecha').innerHTML = `<${contentId}></${contentId}>`;
}

function toggleNav(visible) {
    const sidebar = document.querySelector('sidebar-info');
    const header = document.querySelector('header-info');
    const mainContainer = document.querySelector('.derecha');

    if (visible) {
        sidebar.style.display = 'block';
        header.style.display = 'block';

        mainContainer.classList.remove('full-screen');
    } else {
        sidebar.style.display = 'none';
        header.style.display = 'none';

        mainContainer.classList.add('full-screen');
    }
}