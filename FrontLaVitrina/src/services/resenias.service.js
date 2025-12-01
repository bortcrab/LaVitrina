import { Resenia } from "../models/resenia.js";

const API_URL = '/api/resenias';

export class ReseniasService {

    static getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    static async getReseniasUsuario(idUsuario) {
        try {
            const response = await fetch(`${API_URL}/usuarioReseniado/${idUsuario}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) throw new Error('Error al obtener las reseñas.');

            const datos = await response.json();
            return datos;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * Agrega una nueva reseña a la lista.
     * @param {number} calificacion - La calificación dada (1 a 5).
     * @param {string} titulo - El título de la reseña.
     * @param {string} descripcion - El texto de la reseña.
     * @returns {Promise<Resenia>} La nueva reseña agregada.
     */
    static async agregarResenia(idUsuarioReseniado, datosResenia) {
        try {
            const response = await fetch(`${API_URL}/${idUsuarioReseniado}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(datosResenia)
            });

            const responseData = await response.json();
            if (responseData.status === 'fail') {
                throw new Error(responseData.message);
            }

            return responseData; // Retorna el objeto de la reseña creada
        } catch (error) {
            console.error('ReseniaService:', error.message);
            throw error;
        }
    }

}