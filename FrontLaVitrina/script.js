
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { IniciarSesionComponent } from './src/components/iniciarSesion/iniciarSesion.component.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";
import { HomePage } from './src/pages/home/home.page.js';

window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent); 
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
window.customElements.define('product-info', PublicacionComponent);
window.customElements.define('home-page', HomePage);

document.addEventListener('DOMContentLoaded', function(){
    page('/', () => showContent('home-page'));
    //puse este de ejemplo ahi le mueves parra
    //page('/crear-publicacion', () => showContent('crear-publicacion'));
    page('*', () => showContent('home-page'));

    page();
});


function showContent(contentId){
    document.querySelector('.derecha').innerHTML = `<${contentId}></${contentId}>`;
}

