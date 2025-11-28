import { Publicacion } from '../models/publicacion.js';
import { Usuario } from '../models/usuario.js';

const API_URL = '/api/publicaciones';
const API_CATEGORIAS = 'http://localhost:3000/api/categorias';

export class PublicacionService {
    static #urlService = 'http://localhost:3000/api';
    static #urlPublicaciones = '/publicaciones/';
    static #urlSubastas = '/subastas/';

    static getHeaders() {
        //const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoicmljYXJkbzEyM0BnbWFpbC5jb20iLCJpYXQiOjE3NjQzMTk5ODgsImV4cCI6MTc2NDMyMzU4OH0.nD85dsf_wNqa08eLBMgeJNtUs3nz79gudd6PuIHBcY0` // Tu backend usa validateJWT, así que esto es obligatorio
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

    static async crearPublicacion(datosPublicacion) {
        try {
            let fetchUrl;
            if ('inicioSubasta' in datosPublicacion && 'finSubasta' in datosPublicacion) {
                fetchUrl = this.#urlService + this.#urlSubastas;
            } else {
                fetchUrl = this.#urlService + this.#urlPublicaciones;
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

            console.log('Publicación creada con éxito:', responseData);
            return responseData; // Retorna el objeto de la publicación creada

        } catch (error) {
            console.error('PublicacionService:', error.message);
            throw error;
        }
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

    /**
     * Obtiene la lista de categorías desde la API.
     * @returns {Promise<Array<{id: number, nombre: string}>>} Una promesa con el array de categorías.
     */
    static async obtenerCategorias() {
        try {
            const response = await fetch(`${API_CATEGORIAS}`, {
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