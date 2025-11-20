

import { HeaderComponent } from './src/components/header/header.js';
import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { IniciarSesionComponent } from './src/components/iniciarSesion/iniciarSesion.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";


window.customElements.define('header-info', HeaderComponent);
window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent); 
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
