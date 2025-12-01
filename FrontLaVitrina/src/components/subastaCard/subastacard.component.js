export class SubastaCardComponent extends HTMLElement {

    constructor() {
        super();
        this.cssUrl = new URL('./subastacard.component.css', import.meta.url).href;
        this.intervalId = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const fechaInicio = this.getAttribute('fechaInicio');
        const fechaInicioSubasta = new Date(fechaInicio);
        const fechaFin = this.getAttribute('fechaFin');
        const fechaFinSubasta = new Date(fechaFin);
        this.precio = parseInt(this.getAttribute('precio'));
        this.pujaMayor = parseInt(this.getAttribute('pujaMayor'));
        this.cantidadPujas = this.getAttribute('cantidadPujas');

        const cuentaAtras = {};
        const fechaActual = new Date().getTime();
        if (fechaInicioSubasta > fechaActual) {
            cuentaAtras.fecha = fechaInicioSubasta;
            cuentaAtras.tipo = "Inicio";
        } else {
            cuentaAtras.fecha = fechaFinSubasta;
            cuentaAtras.tipo = "Fin";
        }

        this.#agregaEstilo(shadow);
        this.#render(shadow);
        this.#actualizarContador(shadow, cuentaAtras);
    }

    disconnectedCallback() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    #render(shadow) {
        shadow.innerHTML += `
        <div class="modal-overlay" id="modalError" style="display: none;">
            <error-message-info 
                id="componenteError"
                titulo="Atención" 
                mensaje="" 
                accion="Entendido">
            </error-message-info>
        </div>

        <div class="subasta-container">
            <div class="contador-container">
                <h2>Subasta termina en:</h2>
                <div class="cuenta-atras">
                    <div class="tiempo">
                        <h3 id="dias">00</h3>
                        <h4>Días</h4>
                    </div>
                    <div class="tiempo">
                        <h3 id="horas">00</h3>
                        <h4>Horas</h4>
                    </div>
                    <div class="tiempo">
                        <h3 id="minutos">00</h3>
                        <h4>Minutos</h4>
                    </div>
                    <div class="tiempo">
                        <h3 id="segundos">00</h3>
                        <h4>Segundos</h4>
                    </div>
                </div>
                <div class="contador-info">
                    <h4>Oferta actual:</h4>
                    <h4 id="cantidad-pujas">${this.cantidadPujas} pujas</h4>
                </div>
                <h2 id="oferta-actual">$ ${(this.precio > this.pujaMayor) ? this.precio : this.pujaMayor}.00</h2>
            </div>
            <div class="puja-container">
                <h2>Realizar puja</h2>
                <h4 id="monto-minimo">El monto mínimo es de $ ${(this.precio > this.pujaMayor) ? this.precio + 10 : this.pujaMayor + 10}.00</h4>
                <input type="number" id="puja" placeholder="$ ${(this.precio > this.pujaMayor) ? this.precio + 10 : this.pujaMayor + 10}.00">
                <button id="btn-realizar-puja">Realizar</button>
            </div>
        </div>
		`;
    }

    #agregaEstilo(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", this.cssUrl);
        shadow.appendChild(link);
    }

    #actualizarContador(shadow, cuentaAtras) {
        const dias = shadow.getElementById('dias');
        const horas = shadow.getElementById('horas');
        const minutos = shadow.getElementById('minutos');
        const segundos = shadow.getElementById('segundos');
        const btnRealizarPuja = shadow.getElementById('btn-realizar-puja');

        this.intervalId = setInterval(() => {

            const now = new Date().getTime();
            const distance = cuentaAtras.fecha - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            dias.innerHTML = days < 10 ? '0' + days : days;
            horas.innerHTML = hours < 10 ? '0' + hours : hours;
            minutos.innerHTML = minutes < 10 ? '0' + minutes : minutes;
            segundos.innerHTML = seconds < 10 ? '0' + seconds : seconds;

            if (distance < 0) {
                clearInterval(this.intervalId);
                dias.innerHTML = "0";
                horas.innerHTML = "0";
                minutos.innerHTML = "0";
                segundos.innerHTML = "0";

                if (btnRealizarPuja) {
                    cuentaAtras.tipo === "inicio" ? btnRealizarPuja.disabled = false : btnRealizarPuja.disabled = true;
                }
            }

        }, 1000);
    }

    mostrarError(titulo, mensaje) {
        const modal = this.shadowRoot.getElementById('modalError');
        const componenteError = this.shadowRoot.getElementById('componenteError');

        if (componenteError) {
            componenteError.setAttribute('titulo', titulo);
            componenteError.setAttribute('mensaje', mensaje);
        }

        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10);
        }

        const cerrar = () => {
            modal.classList.remove('visible');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            componenteError.removeEventListener('retry-click', cerrar);
        };

        componenteError.addEventListener('retry-click', cerrar);
    }

    actualizarOferta(nuevaPuja) {
        const shadow = this.shadowRoot;

        const ofertaActual = shadow.getElementById('oferta-actual');
        const montoMinimo = shadow.getElementById('monto-minimo');
        const puja = shadow.getElementById('puja');
        const btnRealizarPuja = shadow.getElementById('btn-realizar-puja');

        ofertaActual.textContent = nuevaPuja.monto;
        montoMinimo.textContent = `$ ${parseInt(nuevaPuja.monto) + 10}.00`;
        puja.placeholder = `$ ${parseInt(nuevaPuja.monto) + 10}.00`;
        btnRealizarPuja.disabled = false;
        btnRealizarPuja.textContent = 'Realizar';
    }

}