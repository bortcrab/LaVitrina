import { RegistrarService } from './registrar.service.js';


const API_URL = '/api/usuarios';

export class IniciarSesionService {
    static getHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }


    static async iniciarSesion(correo, contrasenia) {
        try {
            const response = await fetch(`${API_URL}/iniciar-sesion`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ correo, contrasenia })
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static cerrarSesion() {
        this.usuarioActivo = null;
        page('/iniciar-sesion');
    }

    static obtenerUsuarioActivo() {
        return this.usuarioActivo;
    }

    static estaAutenticado() {
        return this.usuarioActivo !== null;
    }
}