import { Publicacion } from '../models/publicacion.js';

export class PublicacionService {
    static getPublicaciones() {
        const PublicacionList = [
            new Publicacion(
                1,
                "iPhone 11 en muy buen estado",
                "iPhone 11 color verde, 128GB, batería al 85%, con caja y accesorios originales",
                "$10,000",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                ["Electrónica", "Celulares"],
                "Venta",
                "María González"
            ),
            new Publicacion(
                2,
                "MacBook Pro 2020",
                "MacBook Pro 13 pulgadas, 16GB RAM, 512GB SSD, perfectas condiciones",
                "$18,500",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                ["Electrónica", "Computación"],
                "Venta",
                "Tech Store"
            ),
            new Publicacion(
                3,
                "Departamento en renta zona centro",
                "2 recámaras, 1 baño, cocina integral, estacionamiento",
                "$8,000/mes",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
                ["Inmuebles", "Renta"],
                "Venta",
                "Inmobiliaria del Valle"
            ),
            new Publicacion(
                4,
                "Bicicleta de montaña",
                "Bicicleta Trek rodada 29, frenos de disco, suspensión delantera",
                "$7,500",
                "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop",
                ["Deportes", "Aire Libre"],
                "Venta",
                "Juan Pérez"
            ),
            new Publicacion(
                5,
                "PlayStation 5",
                "Consola nueva en caja sellada con 2 controles",
                "$12,000",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
                ["Electrónica", "Videojuegos"],
                "Subasta",
                "Gamers MX"
            ),
            new Publicacion(
                6,
                "Cámara Canon EOS R6",
                "Cámara profesional con lente 24-105mm, menos de 5000 disparos",
                "$45,000",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
                ["Electrónica", "Fotografía"],
                "Venta",
                "Photo Pro"
            ),
            new Publicacion(
                7,
                "Sala de 3 piezas",
                "Sala moderna color gris, incluye sofá de 3 plazas y 2 sillones",
                "$15,000",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
                ["Hogar", "Muebles"],
                "Venta",
                "Muebles Confort"
            ),
            new Publicacion(
                8,
                "Auto Honda Civic 2018",
                "Seminuevo, automático, único dueño, factura original",
                "$180,000",
                "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=500&h=500&fit=crop",
                ["Vehículos", "Autos"],
                "Venta",
                "Autos del Norte"
            ),
            new Publicacion(
                9,
                "Mesa de trabajo para oficina",
                "Escritorio moderno con cajones, perfecto para home office",
                "$2,500",
                "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&h=500&fit=crop",
                ["Oficina", "Muebles"],
                "Venta",
                "Office Solutions"
            )
        ];

        return PublicacionList;
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
}