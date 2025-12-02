import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

export class SubastasService {
    static socket = null;
    static apiUrl = 'http://localhost:3000/api';
    static socketUrl = 'http://localhost:3000';

    static initSocket() {
        const usuarioData = JSON.parse(localStorage.getItem('usuario')); 
        const token = localStorage.getItem('token');

        if (!token) return;

        if (this.socket && this.socket.connected) {
            return;
        }

        this.socket = io(this.socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket']
        });

        this.socket.on('connect', () => console.log('Conectado al subastas server'));
        this.socket.on('connect_error', (err) => console.error('Error en la conexión del socket:', err.message));
    }

    static unirseSubasta(idSubasta) {
        if (this.socket) {
            this.socket.emit('join_subasta', idSubasta);
        }
    }

    static async realizarPuja(idSubasta, pujaData) {
        if (this.socket) {
            this.socket.emit('realizar_puja', { idSubasta, pujaData });
        }
    }

    static escucharNuevasPujas(callback) {
        if (!this.socket) return;
        
        this.socket.off('nueva_puja');
        this.socket.on('nueva_puja', (pujaBackend) => {
            console.log('SI ESCUCHÉ LA PUJA BRO');
            const pujaFormateada = {
                monto: pujaBackend.monto,
                cantidadPujas: pujaBackend.cantidadPujas,
                pujaMayor: pujaBackend.pujaMayor
            };

            console.log(pujaFormateada);

            callback(pujaFormateada);
        });
    }

}