import { Usuario } from '../models/usuario.js';
import { UsuariosService } from './usuario.service.js';

const API_URL = '/api/usuarios';

export class RegistrarService {
    static getHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }

    static async registrarUsuario(datosUsuario) {

        /*if (this.existeCorreo(correo)) {
            return {
                exito: false,
                mensaje: 'Este correo ya está registrado'
            };
        }
        */

        const { foto, ...restoDatos } = datosUsuario;

        let fotoURL = '';
        try {

            if (foto && foto instanceof File) {
                fotoURL = await UsuariosService.subirImagen(foto);
            }

            const payload = {
                ...restoDatos,
                fotoPerfil: fotoURL,
            };

            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar al usuario');

            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async existeCorreo(correo) {
        const responser = await fetch(`${API_URL}/`)
    }



}