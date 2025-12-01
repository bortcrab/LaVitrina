export class ConfirmationMessageComponent extends HTMLElement {
    constructor() {
        super();
        this.cssUrl = new URL('./confirmationMessage.component.css', import.meta.url).href;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    static get observedAttributes() {
        return ['titulo', 'mensaje', 'accion-aceptar', 'accion-cancelar'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.render(this.shadowRoot);
        }
    }

    render(shadow) {
        const titulo = this.getAttribute('titulo') || '¿Estás seguro?';
        const mensaje = this.getAttribute('mensaje') || 'Esta acción no se puede deshacer.';
        const btnAceptar = this.getAttribute('accion-aceptar') || 'Aceptar';
        const btnCancelar = this.getAttribute('accion-cancelar') || 'Cancelar';

        shadow.innerHTML = `
            <link rel="stylesheet" href="${this.cssUrl}">
            
            <div class="confirm-card">
                <div class="icon-container">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
                    </svg>
                </div>
                
                <h2 class="confirm-title">${titulo}</h2>
                <p class="confirm-message">${mensaje}</p>
                
                <div class="btn-container">
                    <button class="btn-cancel" id="btnCancel">${btnCancelar}</button>
                    <button class="btn-confirm" id="btnConfirm">${btnAceptar}</button>
                </div>
            </div>
        `;

        shadow.getElementById('btnCancel').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel-click', { bubbles: true, composed: true }));
        });

        shadow.getElementById('btnConfirm').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('confirm-click', { bubbles: true, composed: true }));
        });
    }
}