import { Usuario } from '../models/usuario.js';

const API_URL = 'http://localhost:3000/api/usuarios';

export class UsuariosService {
    static CLOUD_NAME = 'drczej3mh';
    static UPLOAD_PRESET_FOTOPERFIL = 'fotoperfil_lavitrina';
    
    static getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };
    }

    /**
     * Sube una imagen a Cloudinary y regresa la URL
     */
    static async subirImagen(file) {
        const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.UPLOAD_PRESET_FOTOPERFIL);

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

    /**
     * Obtiene la información completa de un usuario
     * @param {number|string} id - ID del usuario
     */
    static async obtenerUsuarioPorId(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Sesión expirada');
                throw new Error('Error al obtener el usuario');
            }

            const data = await response.json();

            const usuario = new Usuario(
                data.id,
                data.nombres,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.correo,
                "",
                data.telefono,
                data.ciudad,
                data.fechaNacimiento,
                data.fotoPerfil
            );

            usuario.fechaCreacion = data.fechaCreacion;
            usuario.rating = data.calificacion || 0;
            usuario.totalReseñas = data.totalReseñas || 0;
            usuario.avatar = data.fotoPerfil;

            return usuario;

        } catch (error) {
            console.error('UsuariosService Error:', error);
            throw error;
        }
    }

    static async actualizarUsuario(id, datosActualizados) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }

            return await this.obtenerUsuarioPorId(id);

        } catch (error) {
            console.error('UsuariosService Update Error:', error);
            throw error;
        }
    }

    static async getVendedor(vendedorId) {
        return await this.obtenerUsuarioPorId(vendedorId);
    }
}
