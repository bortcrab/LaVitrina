export class ChatService {
    
    static chatsMock = [
        {
            id: 1,
            nombre: "Gilberto Borrego Soto",
            servicio: "Teclado Gamer Mecánico Ocelot",
            ultimoMensaje: "Hola Ernestina! Me interes...",
            avatar: "https://i.pravatar.cc/150?img=15",
            productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
            noLeido: false
        },
        {
            id: 2,
            nombre: "Ana",
            servicio: "Sartén de cocina",
            ultimoMensaje: "Holaaaa!",
            avatar: "https://i.pravatar.cc/150?img=25",
            productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
            noLeido: true
        },
        {
            id: 3,
            nombre: "Luis",
            servicio: "Sartén de cocina",
            ultimoMensaje: "Te voy a reportar porque l...",
            avatar: "https://i.pravatar.cc/150?img=33",
            productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
            noLeido: false
        },
        {
            id: 4,
            nombre: "Diego",
            servicio: "Teclado Gamer",
            ultimoMensaje: "Hola buenas tardes, me gu...",
            avatar: "https://i.pravatar.cc/150?img=14",
            productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
            noLeido: true
        },
        {
            id: 5,
            nombre: "Richi",
            servicio: "Sartén de cocina",
            ultimoMensaje: "Aún tiene disponible el sar...",
            avatar: "https://i.pravatar.cc/150?img=52",
            productoImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
            noLeido: true
        },
        {
            id: 6,
            nombre: "Abel",
            servicio: "Teclado Gamer",
            ultimoMensaje: "Hola uwu, e-eto.. aún tiene...",
            avatar: "https://i.pravatar.cc/150?img=68",
            productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
            noLeido: true
        },
        {
            id: 7,
            nombre: "Vicky",
            servicio: "Teclado Gamer",
            ultimoMensaje: "Hola jeje, ya vendió el tecl...",
            avatar: "https://i.pravatar.cc/150?img=45",
            productoImg: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
            noLeido: true
        }
    ];

    static mensajesMock = {
        1: [
            {
                id: 1,
                texto: "Hola Ernestina! Me interesa el teclado gamer",
                hora: "12:09 PM",
                enviado: false
            },
            {
                id: 2,
                texto: "Hola! Sigue disponible, te gustaría ver algunas fotografías?",
                hora: "12:11 PM",
                enviado: true
            },
            {
                id: 3,
                texto: "Sii por favor si no es mucha molestia",
                hora: "12:22 PM",
                enviado: false
            },
            {
                id: 4,
                imagenes: [
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&h=300&fit=crop"
                ],
                hora: "12:25 PM",
                enviado: true
            }
        ]
    };

    static async obtenerChats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.chatsMock);
            }, 100); 
        });
    }

    static async obtenerMensajes(chatId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mensajesMock[chatId] || []);
            }, 100);
        });
    }

}