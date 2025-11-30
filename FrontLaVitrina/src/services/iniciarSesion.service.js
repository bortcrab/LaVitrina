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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Credenciales inválidas');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    static cerrarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
}