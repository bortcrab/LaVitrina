export class UsuarioService {
    static API_BASE_URL = 'http://localhost:3000/api';
    
    /**
     * Obtiene el perfil del usuario actual
     * @returns {Promise<Object>} Datos del perfil
     */
    static async obtenerPerfil() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/usuario/perfil`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            throw error;
        }
    }

    /**
     * Actualiza el perfil del usuario
     * @param {Object} datosActualizados - Datos del perfil a actualizar
     * @returns {Promise<Object>} Perfil actualizado
     */
    static async actualizarPerfil(datosActualizados) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/usuario/perfil`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    }

    /**
     * Sube una nueva foto de perfil
     * @param {File} archivo - Archivo de imagen
     * @returns {Promise<string>} URL de la imagen subida
     */
    static async subirAvatar(archivo) {
        try {
            const formData = new FormData();
            formData.append('avatar', archivo);

            const response = await fetch(`${this.API_BASE_URL}/usuario/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.avatarUrl;
        } catch (error) {
            console.error('Error al subir avatar:', error);
            throw error;
        }
    }

    /**
     * Obtiene las reseñas del usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Array>} Lista de reseñas
     */
    static async obtenerReseñas(usuarioId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/usuario/${usuarioId}/reseñas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener reseñas:', error);
            throw error;
        }
    }

    /**
     * Inicia sesión
     * @param {string} correo - Correo electrónico
     * @param {string} contraseña - Contraseña
     * @returns {Promise<Object>} Datos de sesión y token
     */
    static async iniciarSesion(correo, contraseña) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contraseña })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
            }

            return data;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }

    /**
     * Registra un nuevo usuario
     * @param {Object} datosUsuario - Datos del nuevo usuario
     * @returns {Promise<Object>} Usuario creado
     */
    static async registrarUsuario(datosUsuario) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }

    /**
     * Cierra la sesión del usuario
     */
    static cerrarSesion() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        window.location.href = '/';
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    static estaAutenticado() {
        return !!this.#obtenerToken();
    }

    /**
     * Obtiene el token de autenticación
     * @private
     * @returns {string|null}
     */
    static #obtenerToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Obtiene los datos del usuario actual desde localStorage
     * @returns {Object|null}
     */
    static obtenerUsuarioActual() {
        const usuarioStr = localStorage.getItem('usuario');
        return usuarioStr ? JSON.parse(usuarioStr) : null;
    }
}