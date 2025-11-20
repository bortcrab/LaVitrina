
import { HeaderComponent } from './src/components/header/header.js';
import { IniciarSesionComponent } from './src/components/iniciarSesion/iniciarSesion.js';
import { RegistrarUsuarioComponent } from './src/components/registrar/registrar.js';

window.customElements.define('header-info', HeaderComponent);
window.customElements.define('iniciar-sesion-info', IniciarSesionComponent); 
window.customElements.define('registrar-usuario-info', RegistrarUsuarioComponent);

