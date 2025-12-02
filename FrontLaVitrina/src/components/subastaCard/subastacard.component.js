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
            cuentaAtras.tipo = "INICIO";
        } else {
            cuentaAtras.fecha = fechaFinSubasta;
            cuentaAtras.tipo = "FIN";
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
                <h2 id="titulo-cuenta-atras">Subasta termina en:</h2>
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
                    <h4 id="oferta">Oferta actual:</h4>
                    <h4 id="cantidad-pujas">${this.cantidadPujas} pujas</h4>
                </div>
                <h2 id="oferta-actual">${(this.precio > this.pujaMayor) ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.precio) : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.pujaMayor)}</h2>
            </div>
            <div class="puja-container" id="puja-card">
                <h2>Realizar puja</h2>
                <h4 id="monto-minimo">El monto mínimo es de ${(this.precio > this.pujaMayor) ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseInt(this.precio) + 10) : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseInt(this.pujaMayor) + 10)}</h4>
                <input type="number" id="puja" placeholder="${(this.precio > this.pujaMayor) ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseInt(this.precio) + 10) : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parseInt(this.pujaMayor) + 10)}">
                <div class="error-message" id="errorMessage"></div>
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
        const pujaCard = shadow.getElementById('puja-card');
        const oferta = shadow.getElementById('oferta');
        const tituloCuentaAtras = shadow.getElementById('titulo-cuenta-atras');

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

            if (cuentaAtras.tipo === 'INICIO') {
                tituloCuentaAtras.textContent = 'Subasta inicia en:'
                pujaCard.style.display = 'none';
            }

            if (distance < 0) {
                clearInterval(this.intervalId);
                dias.innerHTML = "00";
                horas.innerHTML = "00";
                minutos.innerHTML = "00";
                segundos.innerHTML = "00";

                if (btnRealizarPuja) {
                    if (cuentaAtras.tipo === "INICIO") {
                        btnRealizarPuja.disabled = false;
                        pujaCard.style.display = 'block';
                        tituloCuentaAtras.textContent = 'Subasta termina en:'
                    } else {
                        btnRealizarPuja.disabled = true;

                        const oferta = shadow.getElementById('oferta');

                        pujaCard.style.display = 'none';
                        oferta.textContent = 'Oferta final:';
                    }
                }
            }

        }, 1000);
    }

    mostrarError(mensaje) {
        const shadow = this.shadowRoot; // Accedemos al shadowRoot guardado o 'this.shadowRoot'
        if (!shadow) return;

        const errorMessage = shadow.getElementById('errorMessage');

        console.log(mensaje);
        if (mensaje) {
            errorMessage.textContent = mensaje;
            errorMessage.style.display = 'block';
        } else {
            // Si mensaje está vacío, ocultamos
            errorMessage.style.display = 'none';
        }
    }

    actualizarOferta(nuevaPuja) {
        const shadow = this.shadowRoot;

        const ofertaActual = shadow.getElementById('oferta-actual');
        const montoMinimo = shadow.getElementById('monto-minimo');
        const puja = shadow.getElementById('puja');
        const btnRealizarPuja = shadow.getElementById('btn-realizar-puja');
        const cantidadPujas = shadow.getElementById('cantidad-pujas');

        let montoFormateado = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(nuevaPuja.monto);

        ofertaActual.textContent = `${montoFormateado}`;
        cantidadPujas.textContent = `${nuevaPuja.cantidadPujas} pujas`;

        montoFormateado = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(parseInt(nuevaPuja.monto) + 10);

        montoMinimo.textContent = `El monto mínimo es de ${montoFormateado}`;
        puja.placeholder = `${montoFormateado}`;
        btnRealizarPuja.disabled = false;
        btnRealizarPuja.textContent = 'Realizar';
    }

}