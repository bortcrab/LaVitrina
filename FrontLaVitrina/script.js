import { SidebarComponent } from "./src/components/side-bar/sidebar.component.js";
import { HeaderComponent } from './src/components/header/header.js';
import { CrearPublicacionComponent } from "./src/components/crearPublicacion/crearPublicacion.component.js";

window.customElements.define('sidebar-info', SidebarComponent);
window.customElements.define('header-info', HeaderComponent);
window.customElements.define('crear-publicacion', CrearPublicacionComponent);
