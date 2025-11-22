
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { IniciarSesionComponent } from './src/components/iniciarSesion/iniciarSesion.component.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { RegistrarUsuario2Component } from './src/components/registrar/registrar2.component.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";

//pages
import { HomePage } from './src/pages/home/home.page.js';
import { IniciarSesionPage } from "./src/pages/iniciarSesion/iniciarSesion.page.js";


//Definir componentes
window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent);
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
window.customElements.define('product-info', PublicacionComponent);

//definir pages
window.customElements.define('home-page', HomePage);
window.customElements.define('iniciar-sesion-page', IniciarSesionPage);

document.addEventListener('DOMContentLoaded', function () {
    page('/', () => showContent('home-page'));
    page('/iniciar-sesion', () => showContent('iniciar-sesion-page'));
    page('/registrar', () => showContent('registrar-page'));
    page('/registrar-paso2', () => showContent('registrar2-page'));

    page('*', () => showContent('home-page'));

    page();
});


function showContent(contentId) {
    document.querySelector('.derecha').innerHTML = `<${contentId}></${contentId}>`;
}

