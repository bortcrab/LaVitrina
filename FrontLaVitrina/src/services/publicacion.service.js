import { Publicacion } from '../models/publicacion.js';
import { Usuario } from '../models/usuario.js';

export class PublicacionService {
    static getPublicaciones() {

        const userMaria = new Usuario(101, "María", "González");
        userMaria.fotoPerfil = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop";
        userMaria.puntuacion = 4.8;

        const userTech = new Usuario(102, "Tech", "Store");
        userTech.fotoPerfil = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop";
        userTech.puntuacion = 5.0;

        const userJuan = new Usuario(103, "Juan", "Pérez");
        userJuan.fotoPerfil = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop";
        userJuan.puntuacion = 3.5;

        const userPedro = new Usuario(1, "Pedro", "Sola");
        userPedro.fotoPerfil = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop";
        userPedro.puntuacion = 4.9;

        const PublicacionList = [
            new Publicacion(
                1,
                "iPhone 11 en muy buen estado",
                "iPhone 11 color verde, 128GB, batería al 85%, con caja y accesorios originales.",
                "$10,000",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                ["Electrónica"],
                "Disponible",
                false,
                userMaria,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                2,
                "MacBook Pro 2020",
                "MacBook Pro 13 pulgadas, 16GB RAM, 512GB SSD, ideal para trabajo pesado.",
                "$18,500",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                ["Electrónica", "Hogar"],
                "Venta",
                false,
                userTech,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                3,
                "Departamento en renta zona centro",
                "2 recámaras, 1 baño, cocina integral, estacionamiento incluido.",
                "$8,000/mes",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
                ["Inmuebles", "Hogar"],
                "Venta",
                false,
                userTech,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                4,
                "Bicicleta de montaña Trek",
                "Rodada 29, frenos de disco, suspensión delantera. Lista para la aventura.",
                "$7,500",
                "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop",
                ["Deportes", "Vehículos"],
                "Venta",
                false,
                userJuan,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                5,
                "PlayStation 5 Edición Digital",
                "Consola nueva en caja sellada con 2 controles DualSense.",
                "$12,000",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
                ["Electrónica"],
                "Subasta",
                false,
                userJuan,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                6,
                "Chamarra de Cuero Vintage",
                "Talla M, excelente estado, estilo clásico para motociclistas.",
                "$1,200",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
                ["Moda", "Vehículos"],
                "Venta",
                false,
                userTech,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                7,
                "Sala Moderna Gris",
                "Sala de 3 piezas, incluye sofá de 3 plazas y 2 sillones individuales.",
                "$15,000",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
                ["Hogar", "Inmuebles"],
                "Venta",
                false,
                userTech,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                8,
                "Honda Civic 2018",
                "Seminuevo, automático, único dueño, factura original, todos los servicios.",
                "$180,000",
                "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=500&h=500&fit=crop",
                ["Vehículos"],
                "Venta",
                false,
                userMaria,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                9,
                "Tenis Nike Running",
                "Talla 27 MX, tecnología Air Max, ideales para correr o gimnasio.",
                "$2,500",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
                ["Moda", "Deportes"],
                "",
                false,
                userMaria,
                new Date(2025, 10, 20)
            ),
            new Publicacion(
                10,
                "Tablet Samsung Galaxy Tab S6",
                "Incluye S Pen, 128GB de almacenamiento, color azul nube. Poco uso.",
                "$6,800",
                "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop",
                ["Electrónica", "Hogar"],
                "Subasta",
                false,
                userPedro,
                new Date(2025, 10, 20)
            )
        ];

        return PublicacionList;
    }

    static async obtenerPublicacionesPorId(id) {
        const publicaciones = this.getPublicaciones();
        return publicaciones.find(p => p.id == id);
    }

    static crearPublicacion(datosPublicacion) {
        console.log('PublicacionService: Recibiendo datos para crear:', {
            ...datosPublicacion,
            imagenes: datosPublicacion.imagenes.map(f => ({ nombre: f.name, tamaño: f.size }))
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // ✅ VALIDACIONES EN EL SERVICIO (Backend simulado)
                const errores = [];

                // Validar título
                if (!datosPublicacion.titulo || datosPublicacion.titulo.trim() === '') {
                    errores.push("El título es obligatorio.");
                } else if (datosPublicacion.titulo.length < 5) {
                    errores.push("El título debe tener al menos 5 caracteres.");
                } else if (datosPublicacion.titulo.length > 100) {
                    errores.push("El título no puede exceder 100 caracteres.");
                }

                // Validar descripción
                if (!datosPublicacion.descripcion || datosPublicacion.descripcion.trim() === '') {
                    errores.push("La descripción es obligatoria.");
                } else if (datosPublicacion.descripcion.length < 10) {
                    errores.push("La descripción debe tener al menos 10 caracteres.");
                } else if (datosPublicacion.descripcion.length > 1000) {
                    errores.push("La descripción no puede exceder 1000 caracteres.");
                }

                // Validar precio
                if (!datosPublicacion.precio || datosPublicacion.precio <= 0) {
                    errores.push("El precio debe ser mayor a 0.");
                } else if (datosPublicacion.precio > 1000000) {
                    errores.push("El precio no puede exceder $1,000,000.");
                }

                // Validar categoría
                if (!datosPublicacion.categoria || datosPublicacion.categoria === 'Seleccionar') {
                    errores.push("Debes seleccionar una categoría válida.");
                }

                // Validar imágenes
                if (!datosPublicacion.imagenes || datosPublicacion.imagenes.length === 0) {
                    errores.push("Debes agregar al menos una imagen.");
                } else if (datosPublicacion.imagenes.length > 10) {
                    errores.push("No puedes agregar más de 10 imágenes.");
                } else {
                    // Validar tamaño de cada imagen (máx 5MB por imagen)
                    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
                    const imagenesGrandes = datosPublicacion.imagenes.filter(img => img.size > MAX_SIZE);
                    if (imagenesGrandes.length > 0) {
                        errores.push(`Algunas imágenes exceden el tamaño máximo de 5MB.`);
                    }

                    // Validar tipo de archivo
                    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
                    const imagenesInvalidas = datosPublicacion.imagenes.filter(img => !tiposPermitidos.includes(img.type));
                    if (imagenesInvalidas.length > 0) {
                        errores.push("Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF.");
                    }
                }

                // Validar etiquetas
                if (datosPublicacion.etiquetas && datosPublicacion.etiquetas.length > 10) {
                    errores.push("No puedes agregar más de 10 etiquetas.");
                }

                // Validar tipo de publicación
                if (!datosPublicacion.tipoPublicacion || !['venta', 'subasta'].includes(datosPublicacion.tipoPublicacion)) {
                    errores.push("El tipo de publicación debe ser 'venta' o 'subasta'.");
                }

                // Validar fechas de subasta
                if (datosPublicacion.tipoPublicacion === 'subasta') {
                    if (!datosPublicacion.inicioSubasta) {
                        errores.push("La fecha de inicio de subasta es obligatoria.");
                    }
                    if (!datosPublicacion.finSubasta) {
                        errores.push("La fecha de fin de subasta es obligatoria.");
                    }

                    if (datosPublicacion.inicioSubasta && datosPublicacion.finSubasta) {
                        const fechaInicio = new Date(datosPublicacion.inicioSubasta);
                        const fechaFin = new Date(datosPublicacion.finSubasta);
                        const ahora = new Date();

                        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                            errores.push("Las fechas de subasta no son válidas.");
                        } else {
                            if (fechaInicio < ahora) {
                                errores.push("La fecha de inicio debe ser futura.");
                            }
                            if (fechaFin <= fechaInicio) {
                                errores.push("La fecha de fin debe ser posterior a la fecha de inicio.");
                            }
                        }
                    }
                }

                // Si hay errores, rechazar
                if (errores.length > 0) {
                    console.error('❌ PublicacionService: Errores de validación:', errores);
                    reject({
                        message: errores.join(' '),
                        errores: errores
                    });
                    return;
                }

                const publicacionCreada = {
                    id: Date.now(),
                    ...datosPublicacion,
                    vendido: false,
                    fechaCreacion: new Date().toISOString()
                };

                console.log('✅ PublicacionService: Creación simulada exitosa.');
                resolve(publicacionCreada);

            }, 500);
        });
    }


    static async obtenerPublicacion(id) {
        const publicaciones = this.getPublicaciones();

        const idNumerico = parseInt(id);

        const publicacion = publicaciones.find(p => p.id === idNumerico);

        if (!publicacion) {
            console.error(`No se encontró la publicación con id: ${id} (numérico: ${idNumerico})`);
            throw new Error("Publicación no encontrada");
        }

        return JSON.parse(JSON.stringify(publicacion));
    }

    static async editarPublicacion(id, datosActualizados) {
        const publicaciones = this.getPublicaciones();

        const idNumerico = parseInt(id);

        const index = publicaciones.findIndex(p => p.id === idNumerico);

        if (index === -1) throw new Error("Publicación no encontrada");

        publicaciones[index] = {
            ...publicaciones[index],
            ...datosActualizados
        };

        return JSON.parse(JSON.stringify(publicaciones[index]));
    }

    static getPublicacionesPorUsuario(nombreUsuario) {
        const todas = this.getPublicaciones();
        return todas.filter(p => p.usuario.nombres === nombreUsuario);
    }

    static cambiarEstadoVenta(id) {
        const publicaciones = this.getPublicaciones();
        const publicacion = publicaciones.find(p => p.id === parseInt(id));
        if (publicacion) {
            publicacion.vendido = !publicacion.vendido;
            console.log(`Publicación ${id} marcada como ${publicacion.vendido ? 'vendida' : 'disponible'}`);
            return publicacion;
        }
        return null;
    }

    static eliminarPublicacion(id) {
        console.log(`Eliminando publicación ${id} (simulado)`);
        return { success: true, id };
    }

    static filtrarPorEtiqueta(etiqueta) {
        if (etiqueta === 'Todo') {
            return this.publicaciones;
        }
        return this.publicaciones.filter(pub =>
            pub.etiquetas.includes(etiqueta)
        );
    }

    static filtrarPorEstado(estado) {
        return this.publicaciones.filter(pub => pub.estado === estado);
    }

    static filtrarPorDisponibilidad(vendido) {
        return this.publicaciones.filter(pub => pub.vendido === vendido);
    }
}