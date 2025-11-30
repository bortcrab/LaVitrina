export class ExitoMessageComponent extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./exitoMessage.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
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
        const titulo = this.getAttribute('titulo') || '¡Listo!';
        const mensaje = this.getAttribute('mensaje') || 'Operación exitosa.';
        const accion = this.getAttribute('accion') || 'Continuar';

        shadow.innerHTML = `
            <link rel="stylesheet" href="${this.cssUrl}">
            
            <div class="exito-card">
                <div class="icon-container">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
                <h2 class="exito-title">${titulo}</h2>
                <p class="exito-message">${mensaje}</p>
                <button class="btn-continuar" id="btnAction">${accion}</button>
            </div>
        `;

        const btn = shadow.getElementById('btnAction');
        if(btn) {
             btn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('exito-click', {
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }
}