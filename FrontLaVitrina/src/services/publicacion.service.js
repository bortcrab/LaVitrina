import { Publicacion } from '../models/publicacion.js';
import { Usuario } from '../models/usuario.js';

const API_URL = '/api/publicaciones';

export class PublicacionService {
    static getHeaders() {
        //const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoicmljYXJkbzEyM0BnbWFpbC5jb20iLCJpYXQiOjE3NjQxMjYxMjksImV4cCI6MTc2NDEyOTcyOX0.hpk1XLRR5b13kW-RD1QjzOkhIwj08BhiwT-qK0XjzwM` // Tu backend usa validateJWT, así que esto es obligatorio
        };
    }

    static async getPublicaciones() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: this.getHeaders() 
            });

            if (!response.ok) throw new Error('Error al obtener publicaciones');
            
            const datos = await response.json();
            return datos; 
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    static async obtenerPublicacion(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) throw new Error('Publicación no encontrada');

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static crearPublicacion(datosPublicacion) {
        console.log('PublicacionService: Recibiendo datos para crear:', {
            ...datosPublicacion,
            imagenes: datosPublicacion.imagenes.map(f => ({ nombre: f.name, tamaño: f.size }))
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
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