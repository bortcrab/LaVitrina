//componentes
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.component.js';
import { PublicacionComponent } from "./src/components/publicacionCard/publicacionCard.component.js";
import { PublicacionOpcionesComponent } from "./src/components/publicacionCardOpciones/publicacionCardOpciones.component.js";
import { PerfilComponent } from './src/components/perfil/perfil.component.js';
import { ChatsComponent } from './src/components/chats/chats.component.js';
import { IniciarSesionComponent } from "./src/components/iniciarSesion/iniciarSesion.component.js";
import { ReseniaCardComponent } from "./src/components/reseniaCard/reseniacard.component.js";
import { SubastaCardComponent } from "./src/components/subastaCard/subastacard.component.js";
import { ErrorMessageComponent } from "./src/components/errorMessage/errorMessage.component.js";
import { ExitoMessageComponent } from "./src/components/exitoMessage/exitoMessage.component.js";
import { ConfirmationMessageComponent } from "./src/components/confirmationMessage/confirmationMessage.component.js";

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
import { ReseniasPage } from "./src/pages/resenias/resenias.page.js";
import { DetallePublicacionPage } from "./src/pages/detallePublicacion/detallepublicacion.page.js";

//definir componentes
window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('publicacion-info', PublicacionComponent);
window.customElements.define('publicacion-opciones-info', PublicacionOpcionesComponent);
window.customElements.define('perfil-info', PerfilComponent);
window.customElements.define('chats-info', ChatsComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent);
window.customElements.define('detalle-publicacion-info', DetallePublicacionPage);
window.customElements.define('resenia-card-info', ReseniaCardComponent);
window.customElements.define('subasta-card-info', SubastaCardComponent);
window.customElements.define('error-message-info', ErrorMessageComponent);
window.customElements.define('exito-message-info', ExitoMessageComponent);
window.customElements.define('confirmation-message-info', ConfirmationMessageComponent);

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
window.customElements.define('resenias-info', ReseniasPage);

function esTokenValido(token) {
    if (!token) return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        const ahora = Math.floor(Date.now() / 1000);

        if (payload.exp < ahora) {
            return false;
        }

        return true;

    } catch (error) {
        console.error("Token corrupto o inválido");
        return false;
    }
}

function verificarSesion(ctx, next) {
    const token = localStorage.getItem('token');

    if (!token || !esTokenValido(token)) {
        console.warn("Acceso denegado: Sesión inexistente o expirada.");

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        page.redirect('/iniciar-sesion');
    } else {
        next();
    }
}

function redirigirSiEstaLogueado(ctx, next) {
    const token = localStorage.getItem('token');
    if (token) {
        page.redirect('/home-page');
    } else {
        next();
    }
}

document.addEventListener('DOMContentLoaded', function () {

    page('/home-page', verificarSesion, () => {
        toggleNav(true);
        showContent('home-page');
    });

    page('/perfil', verificarSesion, () => {
        toggleNav(true);
        showContent('perfil-page');
    });

    page('/chats', verificarSesion, () => {
        toggleNav(true);
        showContent('chats-page');
    });

    page('/crear-publicacion', verificarSesion, () => {
        toggleNav(true);
        showContent('crear-publicacion-page');
    });

    page('/editar-publicacion/:id', verificarSesion, (publicacion) => {
        toggleNav(true);
        const idPublicacion = publicacion.params.id;
        showContent('editar-publicacion-page', { id: idPublicacion });
    });

    page('/agregar-resenia', verificarSesion, () => {
        toggleNav(true);
        showContent('agregar-resenia-page');
    });


    page('/resenias/:id', verificarSesion, (req) => {
        toggleNav(true);
        const idUsuario = req.params.id;
        showContent('resenias-info', { id: idUsuario });
    });

    page('/mis-publicaciones', verificarSesion, () => {
        toggleNav(true);
        showContent('mis-publicaciones-page');
    });

    page('/detalle-publicacion/:id', verificarSesion, (publicacion) => {
        toggleNav(true);
        const idPublicacion = publicacion.params.id;
        showContent('detalle-publicacion-info', { id: idPublicacion });
    });

    page('/agregar-resenia/:id', verificarSesion, (resenia) => {
        toggleNav(true);
        const idUsuario = resenia.params.id;
        showContent('agregar-resenia-page', { id: idUsuario });
    });

    //RUTAS PUBLICAAAAS

    page('/iniciar-sesion', redirigirSiEstaLogueado, () => {
        toggleNav(false);
        showContent('iniciar-sesion-page');
    });

    page('/registrar', redirigirSiEstaLogueado, () => {
        toggleNav(false);
        showContent('registrar-page');
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