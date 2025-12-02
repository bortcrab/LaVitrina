const jwt = require('jsonwebtoken');
const MensajesDAO = require('../dataAccess/mensajesDAO.js');
const pujasDAO = require('../dataAccess/pujasDAO.js');
const publicacionesDAO = require('../dataAccess/publicacionesDAO.js');
const subastasDAO = require('../dataAccess/subastasDAO.js');

class SocketController {
    constructor(io) {
        this.io = io;
        this.init();
    }

    init() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error("Autenticación requerida"));

            try {
                const tokenLimpio = token.replace('Bearer ', '');
                const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
                socket.usuario = decoded;
                next();
            } catch (err) {
                next(new Error("Token inválido"));
            }
        });

        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
    }

    handleConnection(socket) {
        console.log(`Usuario conectado al socket: ID ${socket.usuario.id}`);

        socket.on('realizar_puja', (data) => {
            this.realizarPuja(socket, data);
        });

        socket.on('join_subasta', (idSubasta) => {
            this.unirseSubasta(socket, idSubasta);
        });

        socket.on('join_chat', (idChat) => {
            this.unirseSala(socket, idChat);
        });

        socket.on('enviar_mensaje', (data) => {
            this.enviarMensaje(socket, data);
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    }

    unirseSubasta(socket, idSubasta) {
        socket.join(`subasta_${idSubasta}`);
    }

    unirseSala(socket, idChat) {
        socket.join(`chat_${idChat}`);
    }

    async enviarMensaje(socket, { idChat, texto }) {
        try {
            const mensajeGuardado = await MensajesDAO.crearMensaje(idChat, socket.usuario.id, { texto });

            this.io.to(`chat_${idChat}`).emit('nuevo_mensaje', mensajeGuardado.toJSON());

        } catch (error) {
            console.error("Error en socket controller:", error);
            socket.emit('error_mensaje', { error: 'No se pudo guardar el mensaje' });
        }
    }

    async realizarPuja(socket, { idSubasta, pujaData }) {
        try {
            pujaData.idSubasta = idSubasta;

            const puja = await pujasDAO.crearPuja(pujaData);

            const subasta = await subastasDAO.obtenerSubastaPorId(idSubasta);

            console.log(subasta);

            const datosPuja = {
                monto: puja.monto,
                cantidadPujas: subasta.Pujas.length,
                pujaMayor: subasta.Pujas[0].monto
            } 

            this.io.to(`subasta_${idSubasta}`).emit('nueva_puja', datosPuja);
        } catch (error) {
            console.log('Error en socket controller:', error);
            socket.emit('error_mensaje', { error: 'No se pudo realizar la puja.' })
        }
    }
}

module.exports = SocketController;