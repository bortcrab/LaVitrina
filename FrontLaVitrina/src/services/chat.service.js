import { Chat } from '../models/chat.js';

export class ChatService {
    
    static chatsMockData = [
        {
            id: 1,
            nombre: "Gilberto - Pedro - Teclado Gamer",
            fechaCreacion: "2025-10-20",
            idPublicacion: 101,
            Publicacion: {
                id: 101,
                titulo: "Teclado Gamer Mecánico Ocelot",
                ImagenesPublicacions: [{ url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop" }]
            },
            Usuarios: [
                { id: 1, nombres: "Pedro", fotoPerfil: "https://i.pravatar.cc/150?img=12" },
                { id: 15, nombres: "Gilberto", fotoPerfil: "https://i.pravatar.cc/150?img=15" }
            ],
            Mensajes: [
                {
                    id: 50,
                    fechaEnviado: "2025-11-23T12:09:00",
                    idUsuario: 15,
                    MensajeTexto: { texto: "Hola Pedro! Me interesa el teclado." }
                }
            ]
        },
        {
            id: 2,
            nombre: "Ana - Pedro - Sartén de cocina",
            fechaCreacion: "2025-10-21",
            idPublicacion: 102,
            Publicacion: {
                id: 102,
                titulo: "Sartén de hierro fundido",
                ImagenesPublicacions: [{ url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" }]
            },
            Usuarios: [
                { id: 1, nombres: "Pedro", fotoPerfil: "https://i.pravatar.cc/150?img=12" },
                { id: 25, nombres: "Ana", fotoPerfil: "https://i.pravatar.cc/150?img=25" }
            ],
            Mensajes: [
                {
                    id: 55,
                    fechaEnviado: "2025-11-23T14:05:00",
                    idUsuario: 25,
                    MensajeImagen: { imagen: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },
                    MensajeTexto: null
                }
            ]
        },
        {
            id: 3,
            nombre: "Luis - Pedro - Bicicleta Trek",
            fechaCreacion: "2025-10-22",
            idPublicacion: 103,
            Publicacion: {
                id: 103,
                titulo: "Bicicleta de Montaña Trek",
                ImagenesPublicacions: [{ url: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=200&h=200&fit=crop" }]
            },
            Usuarios: [
                { id: 1, nombres: "Pedro", fotoPerfil: "https://i.pravatar.cc/150?img=12" },
                { id: 33, nombres: "Luis", fotoPerfil: "https://i.pravatar.cc/150?img=33" }
            ],
            Mensajes: [
                {
                    id: 60,
                    fechaEnviado: "2025-11-23T16:30:00",
                    idUsuario: 1,
                    MensajeTexto: { texto: "Ya llegué al punto de encuentro." }
                }
            ]
        },
        {
            id: 4,
            nombre: "Marta - Pedro - iPhone 11",
            fechaCreacion: "2025-10-24",
            idPublicacion: 104,
            Publicacion: {
                id: 104,
                titulo: "iPhone 11 64GB",
                ImagenesPublicacions: [{ url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop" }]
            },
            Usuarios: [
                { id: 1, nombres: "Pedro", fotoPerfil: "https://i.pravatar.cc/150?img=12" },
                { id: 42, nombres: "Marta", fotoPerfil: "https://i.pravatar.cc/150?img=44" }
            ],
            Mensajes: [
                {
                    id: 70,
                    fechaEnviado: "2025-11-24T09:00:00",
                    idUsuario: 42,
                    MensajeTexto: { texto: "¿Aceptas cambios?" }
                }
            ]
        }
    ];

    static mensajesDetalleMock = {
        1: [
            { id: 1, texto: "Hola Ernestina! Me interesa el teclado gamer", hora: "12:09 PM", enviado: false }, // Gilberto
            { id: 2, texto: "Hola! Sigue disponible, ¿te gustaría ver más fotos?", hora: "12:11 PM", enviado: true }, // Yo (Pedro)
            { id: 3, texto: "Sii por favor si no es mucha molestia", hora: "12:22 PM", enviado: false }
        ],
        2: [
            { id: 10, texto: "¿El sartén tiene teflón?", hora: "02:00 PM", enviado: true }, // Yo
            { id: 11, texto: "Sí, mira el estado, está como nuevo:", hora: "02:05 PM", enviado: false }, // Ana
            { 
                id: 12, 
                imagenes: ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300"], 
                hora: "02:05 PM", 
                enviado: false 
            },
            { id: 13, texto: "Se ve muy bien, te ofrezco 200.", hora: "02:10 PM", enviado: true }
        ],
        3: [
            { id: 20, texto: "¿Dónde entregas?", hora: "04:00 PM", enviado: false },
            { id: 21, texto: "En el centro, frente a la catedral.", hora: "04:15 PM", enviado: true },
            { id: 22, texto: "Va, voy para allá.", hora: "04:20 PM", enviado: false },
            { id: 23, texto: "Ya llegué al punto de encuentro.", hora: "04:30 PM", enviado: true }
        ],
        4: [
            { id: 30, texto: "Hola, ¿cuánto es lo menos?", hora: "08:50 AM", enviado: false },
            { id: 31, texto: "El precio es fijo, disculpa.", hora: "08:55 AM", enviado: true },
            { id: 32, texto: "¿Aceptas cambios?", hora: "09:00 AM", enviado: false }
        ]
    };

    static async obtenerChats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const miIdUsuario = 1;

                const chatsModelados = this.chatsMockData.map(data => {
                    const chat = new Chat(
                        data.id,
                        data.nombre,
                        data.fechaCreacion,
                        data.idPublicacion,
                        data.Usuarios,
                        data.Mensajes,
                        data.Publicacion
                    );

                    return {
                        id: chat.id,
                        nombre: chat.getNombreMostrar(miIdUsuario),
                        servicio: chat.getServicioMostrar(),
                        ultimoMensaje: chat.getUltimoMensajeTexto(),
                        avatar: chat.getAvatar(miIdUsuario),
                        productoImg: chat.getProductoImg(),
                        noLeido: !chat.esUltimoMensajeMio(miIdUsuario)
                    };
                });

                resolve(chatsModelados);
            }, 150); 
        });
    }

    static async obtenerMensajes(chatId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mensajesDetalleMock[chatId] || []);
            }, 150);
        });
    }

    static async enviarMensaje(chatId, texto) {
        console.log(`Enviando a chat ${chatId}: ${texto}`);
        return true;
    }
}