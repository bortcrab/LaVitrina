export class ErrorMessageComponent extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./errorMessage.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    static get observedAttributes() {
        return ['titulo', 'mensaje', 'accion'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.render(this.shadowRoot);
        }
    }

    render(shadow) {
        const titulo = this.getAttribute('titulo') || '¡Ups! Algo salió mal';
        const mensaje = this.getAttribute('mensaje') || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
        const accion = this.getAttribute('accion') || 'Reintentar';

        shadow.innerHTML = `
            <link rel="stylesheet" href="${this.cssUrl}">
            
            <div class="error-card">
                <div class="icon-container">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
                    </svg>
                </div>
                
                <h2 class="error-title">${titulo}</h2>
                <p class="error-description">${mensaje}</p>
                
                <button class="btn-retry" id="btnAction">${accion}</button>
            </div>
        `;

        const btn = shadow.getElementById('btnAction');
        btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('retry-click', {
                bubbles: true,
                composed: true
            }));
        });
    }
}