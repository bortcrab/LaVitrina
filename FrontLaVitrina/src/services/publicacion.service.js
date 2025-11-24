import { Publicacion } from '../models/publicacion.js';

export class PublicacionService {
    static getPublicaciones() {
        const PublicacionList = [
            new Publicacion(
                1,
                "iPhone 11 en muy buen estado",
                "iPhone 11 color verde, 128GB, batería al 85%, con caja y accesorios originales.",
                "$10,000",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                ["Electrónica"],
                "Venta",
                "María González"
            ),
            new Publicacion(
                2,
                "MacBook Pro 2020",
                "MacBook Pro 13 pulgadas, 16GB RAM, 512GB SSD, ideal para trabajo pesado.",
                "$18,500",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                ["Electrónica", "Hogar"],
                "Venta",
                "Tech Store"
            ),
            new Publicacion(
                3,
                "Departamento en renta zona centro",
                "2 recámaras, 1 baño, cocina integral, estacionamiento incluido.",
                "$8,000/mes",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
                ["Inmuebles", "Hogar"],
                "Venta",
                "Inmobiliaria del Valle"
            ),
            new Publicacion(
                4,
                "Bicicleta de montaña Trek",
                "Rodada 29, frenos de disco, suspensión delantera. Lista para la aventura.",
                "$7,500",
                "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop",
                ["Deportes", "Vehículos"],
                "Venta",
                "Juan Pérez"
            ),
            new Publicacion(
                5,
                "PlayStation 5 Edición Digital",
                "Consola nueva en caja sellada con 2 controles DualSense.",
                "$12,000",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
                ["Electrónica"],
                "Subasta",
                "Gamers MX"
            ),
            new Publicacion(
                6,
                "Chamarra de Cuero Vintage",
                "Talla M, excelente estado, estilo clásico para motociclistas.",
                "$1,200",
                "https://images.unsplash.com/photo-1551028919-ac66c5f8b63b?w=500&h=500&fit=crop",
                ["Moda", "Vehículos"],
                "Venta",
                "Vintage Shop"
            ),
            new Publicacion(
                7,
                "Sala Moderna Gris",
                "Sala de 3 piezas, incluye sofá de 3 plazas y 2 sillones individuales.",
                "$15,000",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
                ["Hogar", "Inmuebles"],
                "Venta",
                "Muebles Confort"
            ),
            new Publicacion(
                8,
                "Honda Civic 2018",
                "Seminuevo, automático, único dueño, factura original, todos los servicios.",
                "$180,000",
                "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=500&h=500&fit=crop",
                ["Vehículos"],
                "Venta",
                "Autos del Norte"
            ),
            new Publicacion(
                9,
                "Tenis Nike Running",
                "Talla 27 MX, tecnología Air Max, ideales para correr o gimnasio.",
                "$2,500",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
                ["Moda", "Deportes"],
                "Venta",
                "Sport Life"
            ),
            new Publicacion(
                10,
                "Tablet Samsung Galaxy Tab S6",
                "Incluye S Pen, 128GB de almacenamiento, color azul nube. Poco uso.",
                "$6,800",
                "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop",
                ["Electrónica", "Hogar"],
                "Subasta",
                "Pedro Sola"
            )
        ];


        return PublicacionList;
    }

    static obtenerPublicacionesPorId(id) {
        const productos = this.getPublicaciones();
        return productos.find(p => p.id == id);
    }
    
    static crearPublicacion(datosPublicacion) {
        console.log('PublicacionService: Recibiendo datos para crear:', {
            ...datosPublicacion,
            // Mostrar solo nombres y tamaños de las imágenes para el log
            imagenes: datosPublicacion.imagenes.map(f => ({ nombre: f.name, tamaño: f.size }))
        });

        return new Promise((resolve, reject) => {
            // Simular un tiempo de espera de 500ms para la red/servidor
            setTimeout(() => {
                // Validación MOCK: Si no hay título, simular un error
                if (!datosPublicacion.titulo) {
                    console.error('PublicacionService: Error simulado - Título vacío.');
                    reject({ message: "El título de la publicación es obligatorio." });
                    return;
                }

                // Generar la publicación simulada con un ID
                const publicacionCreada = {
                    id: Date.now(),
                    ...datosPublicacion,
                    fechaCreacion: new Date().toISOString()
                };

                // En un entorno real, aquí se enviarían los datos (incluyendo archivos) a la API.
                console.log('✅ PublicacionService: Creación simulada exitosa.');
                resolve(publicacionCreada);

            }, 500); // 0.5 segundos de latencia simulada
        });
    }

    static getPublicacionesPorUsuario(nombreUsuario) {
        const todas = this.getPublicaciones();
        return todas.filter(p => p.usuario === nombreUsuario);
    }
}