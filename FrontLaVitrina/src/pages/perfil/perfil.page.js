import { PerfilService } from '../../services/perfil.service.js';

export class PerfilPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#inicializarDatos(shadow);
        this.#agregarEventListeners(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `<perfil-info id="perfilComponent"></perfil-info>`;
    }

    async #inicializarDatos(shadow) {
        try {
            const usuario = await PerfilService.obtenerPerfil();
            const perfilComponent = shadow.getElementById('perfilComponent');

            if (perfilComponent) {
                perfilComponent.usuario = usuario; 
            }
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
        }
    }

    #agregarEventListeners(shadow) {
        const perfilComponent = shadow.getElementById('perfilComponent');

        perfilComponent.addEventListener('guardar-cambios', async (e) => {
            const datosActualizados = e.detail;
            try {
                const usuarioActualizado = await PerfilService.actualizarPerfil(datosActualizados);
                perfilComponent.usuario = usuarioActualizado;
                alert('Perfil actualizado con éxito');
            } catch (error) {
                console.error('Error al actualizar:', error);
                alert('No se pudo actualizar el perfil');
            }
        });
    }
}