//componentes
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";
import { PublicacionOpcionesComponent } from "./src/components/publicacionCardOpciones/publicacionCardOpciones.component.js";
import { PerfilComponent } from './src/components/perfil/perfil.component.js';
import { ChatsComponent } from './src/components/chats/chats.component.js';
import { IniciarSesionComponent } from "./src/components/iniciarSesion/iniciarSesion.component.js";
import { ReseniasComponent } from "./src/components/resenias/resenias.component.js";
import { DetallePublicacionComponent } from "./src/components/detallePublicacion/detallepublicacion.component.js";
import { ReseniaCardComponent } from "./src/components/reseniaCard/reseniacard.component.js";
import { SubastaCardComponent } from "./src/components/subastaCard/subastacard.component.js";

//Pages
import { HomePage } from './src/pages/home/home.page.js';
import { IniciarSesionPage } from './src/pages/iniciarSesion/iniciarSesion.page.js';
import { RegistrarPage } from "./src/pages/registrar.page.js/registrar.page.js";
import { PerfilPage } from './src/pages/perfil/perfil.page.js';
import { ChatsPage } from './src/pages/chats/chats.page.js';
import { CrearPublicacionPage } from "./src/pages/crearPublicacion/crearPublicacion.page.js";
import { EditarPublicacionPage } from "./src/pages/editarPublicacion/editarPublicacion.page.js";
import { AgregarReseniaPage } from "./src/pages/agregarResenia/agregarResenia.page.js";
import { MisPublicacionesPage } from './src/pages/misPublicaciones/misPublicaciones.page.js';

//definir componentes
window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('publicacion-info', PublicacionComponent);
window.customElements.define('publicacion-opciones-info', PublicacionOpcionesComponent);
window.customElements.define('perfil-info', PerfilComponent);
window.customElements.define('chats-info', ChatsComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent);
window.customElements.define('resenias-info', ReseniasComponent);
window.customElements.define('detalle-publicacion-info', DetallePublicacionComponent);
window.customElements.define('resenia-card-info', ReseniaCardComponent);
window.customElements.define('subasta-card-info', SubastaCardComponent);

//definir pages
window.customElements.define('home-page', HomePage);
window.customElements.define('iniciar-sesion-page', IniciarSesionPage);
window.customElements.define('registrar-page', RegistrarPage);
window.customElements.define('perfil-page', PerfilPage);
window.customElements.define('chats-page', ChatsPage);
window.customElements.define('crear-publicacion-page', CrearPublicacionPage);
window.customElements.define('editar-publicacion-page', EditarPublicacionPage);
window.customElements.define('agregar-resenia-page', AgregarReseniaPage);
window.customElements.define('mis-publicaciones-page', MisPublicacionesPage);

document.addEventListener('DOMContentLoaded', function () {

    page('/home-page', () => {
        toggleNav(true);
        showContent('home-page');
    });

    page('/perfil', () => {
        toggleNav(true);
        showContent('perfil-page');
    });

    page('/chats', () => {
        toggleNav(true);
        showContent('chats-page');
    });

    page('/crear-publicacion', () => {
        toggleNav(true);
        showContent('crear-publicacion-page');
    });

    page('/editar-publicacion', () => {
        toggleNav(true);
        showContent('editar-publicacion-page');
    });

    page('/agregar-resenia', () => {
        toggleNav(true);
        showContent('agregar-resenia-page');
    });

    page('/iniciar-sesion', () => {
        toggleNav(false);
        showContent('iniciar-sesion-page');
    });

    page('/registrar', () => {
        toggleNav(false);
        showContent('registrar-page');
    });

    page('/resenias', (ctx) => {
        toggleNav(true);
        const datos = ctx.state || {};
        showContent('resenias-info', datos);
    });

    page('/mis-publicaciones', () => {
        toggleNav(true);
        showContent('mis-publicaciones-page');
    });

    page('/detalle-publicacion/:id', (publicacion) => {
        toggleNav(true); 
        const idPublicacion = publicacion.params.id; 
        showContent('detalle-publicacion-info', { id: idPublicacion });
    });

    page('/agregar-resenia', () => {
        toggleNav(true);
        showContent('agregar-resenia-page');
    });

    page('*', () => {
        toggleNav(false);
        showContent('iniciar-sesion-page');
    });

    page();
});

function showContent(contentId, data = {}) {
    const container = document.querySelector('.derecha');
    container.innerHTML = '';

    const element = document.createElement(contentId);

    if (data.nombres) element.setAttribute('nombres', data.nombres);
    if (data.puntuacion) element.setAttribute('puntuacion', data.puntuacion);
    if (data.fotoPerfil) element.setAttribute('fotoPerfil', data.fotoPerfil);
    if (data.id) element.setAttribute('id', data.id);

    container.appendChild(element);
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