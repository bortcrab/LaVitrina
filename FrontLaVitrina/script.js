//componentes
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";
import { PerfilComponent } from './src/components/perfil/perfil.component.js';
import { ChatsComponent } from './src/components/chats/chats.component.js';
import { IniciarSesionComponent } from "./src/components/iniciarSesion/iniciarSesion.component.js";
//Pages
import { HomePage } from './src/pages/home/home.page.js';
import { IniciarSesionPage } from './src/pages/iniciarSesion/iniciarSesion.page.js';

//definir componentes
window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
window.customElements.define('product-info', PublicacionComponent);
window.customElements.define('perfil-info', PerfilComponent);
window.customElements.define('chats-info', ChatsComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent);

//definir pages
window.customElements.define('home-page', HomePage);
window.customElements.define('iniciar-sesion-page', IniciarSesionPage);

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

    page('/iniciar-sesion', () => {
        toggleNav(false);
        showContent('iniciar-sesion-page'); 
    });

    page('*', () => {
        toggleNav(false);
        showContent('iniciar-sesion-page');
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