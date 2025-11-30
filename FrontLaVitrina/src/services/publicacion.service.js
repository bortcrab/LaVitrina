import { Publicacion } from '../models/publicacion.js';
import { Usuario } from '../models/usuario.js';

const API_URL = '/api/publicaciones';
const API_CATEGORIAS_URL = '/api/categorias';
const API_SUBASTAS_URL = '/api/subastas';

export class PublicacionService {
    static CLOUD_NAME = 'dfajliqq7';
    static UPLOAD_PRESET = 'LAVITRINA';

    static getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            console.error("Ha ocurrido un erro al obtener las publicaciones");
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

    static async buscarPublicaciones(titulo) {
        try {
            const response = await fetch(`${API_URL}/buscar?titulo=${encodeURIComponent(titulo)}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) throw new Error('Error en la búsqueda');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async obtenerPublicacionesPorCategoria(idCategoria) {
        try {
            const response = await fetch(`${API_URL}/categoria/${idCategoria}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) throw new Error('Error al filtrar por categoría');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async obtenerSubasta(id) {
        try {
            const response = await fetch(`${API_SUBASTAS_URL}/${id}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) throw new Error('Subasta no encontrada');

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Sube una imagen a Cloudinary y regresa la URL
     */
    static async subirImagen(file) {
        const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.UPLOAD_PRESET);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen a cloudinary');
            }

            const data = await response.json();
            return data.secure_url;

        } catch (error) {
            console.error('Error cloudinary:', error);
            throw error;
        }
    }


    static async crearPublicacion(datosPublicacion) {
        try {
            let fetchUrl;
            if ('inicioSubasta' in datosPublicacion && 'finSubasta' in datosPublicacion) {
                fetchUrl = API_SUBASTAS_URL;
            } else {
                fetchUrl = API_URL;
            }
            // Asegúrate de que API_URL sea el endpoint correcto para crear (e.g., '/publicaciones')
            const response = await fetch(fetchUrl, {
                // 1. Usa el método POST para crear recursos
                method: 'POST',
                headers: this.getHeaders(),
                // 3. Convierte el objeto JavaScript a una cadena JSON para el cuerpo
                body: JSON.stringify(datosPublicacion)
            });

            const responseData = await response.json();
            if (responseData.status === 'fail') {
                throw new Error(responseData.message);
            }

            return responseData; // Retorna el objeto de la publicación creada

        } catch (error) {
            console.error('PublicacionService:', error.message);
            throw error;
        }
    }

    static async editarPublicacion(idPublicacion, datosActualizados) {
        console.log(JSON.stringify(datosActualizados, null, 2));
        try {
            let fetchUrl;
            if ('inicioSubasta' in datosActualizados && 'finSubasta' in datosActualizados) {
                fetchUrl = `${API_SUBASTAS_URL}/${idPublicacion}`;
            } else {
                fetchUrl = `${API_URL}/${idPublicacion}`;
            }
            // Asegúrate de que API_URL sea el endpoint correcto para crear (e.g., '/publicaciones')
            const response = await fetch(fetchUrl, {
                // 1. Usa el método POST para crear recursos
                method: 'PUT',
                headers: this.getHeaders(),
                // 3. Convierte el objeto JavaScript a una cadena JSON para el cuerpo
                body: JSON.stringify(datosActualizados)
            });

            const responseData = await response.json();
            if (responseData.status === 'fail') {
                throw new Error(responseData.message);
            }

            return responseData; // Retorna el objeto de la publicación creada
        } catch (error) {
            console.error('PublicacionService:', error.message);
            throw error;
        }
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

    /**
     * Obtiene la lista de categorías desde la API.
     * @returns {Promise<Array<{id: number, nombre: string}>>} Una promesa con el array de categorías.
     */
    static async obtenerCategorias() {
        try {
            const response = await fetch(`${API_CATEGORIAS_URL}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                // Lanza un error si el servidor responde con un status 4xx o 5xx
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las categorías de la API.');
            }

            const categorias = await response.json();
            return categorias;

        } catch (error) {
            console.error('Error en PublicacionService.obtenerCategorias:', error);
            // Relanzamos el error para que el componente pueda manejarlo (ej. mostrar un mensaje al usuario)
            throw error;
        }
    }
}