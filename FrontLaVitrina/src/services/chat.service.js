export class ChatService {
    static API_BASE_URL = 'http://localhost:3000/api';
    
    /**
     * Obtiene todos los chats del usuario actual
     * @returns {Promise<Array>} Lista de chats
     */
    static async obtenerChats() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats`, {
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
            console.error('Error al obtener chats:', error);
            throw error;
        }
    }

    /**
     * Obtiene los mensajes de un chat específico
     * @param {number} chatId - ID del chat
     * @returns {Promise<Array>} Lista de mensajes
     */
    static async obtenerMensajes(chatId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats/${chatId}/mensajes`, {
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
            console.error('Error al obtener mensajes:', error);
            throw error;
        }
    }

    /**
     * Envía un mensaje de texto
     * @param {number} chatId - ID del chat
     * @param {string} texto - Contenido del mensaje
     * @returns {Promise<Object>} Mensaje enviado
     */
    static async enviarMensaje(chatId, texto) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats/${chatId}/mensajes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                },
                body: JSON.stringify({ texto })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            throw error;
        }
    }

    /**
     * Envía imágenes en un mensaje
     * @param {number} chatId - ID del chat
     * @param {FileList} archivos - Archivos de imagen
     * @param {string} texto - Texto opcional del mensaje
     * @returns {Promise<Object>} Mensaje enviado
     */
    static async enviarImagenes(chatId, archivos, texto = '') {
        try {
            const formData = new FormData();
            formData.append('texto', texto);
            
            for (let i = 0; i < archivos.length; i++) {
                formData.append('imagenes', archivos[i]);
            }

            const response = await fetch(`${this.API_BASE_URL}/chats/${chatId}/mensajes/imagenes`, {
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
            return data;
        } catch (error) {
            console.error('Error al enviar imágenes:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo chat con otro usuario
     * @param {number} usuarioId - ID del usuario con quien chatear
     * @param {number} productoId - ID del producto relacionado
     * @returns {Promise<Object>} Chat creado
     */
    static async crearChat(usuarioId, productoId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                },
                body: JSON.stringify({ usuarioId, productoId })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear chat:', error);
            throw error;
        }
    }

    /**
     * Marca los mensajes de un chat como leídos
     * @param {number} chatId - ID del chat
     * @returns {Promise<void>}
     */
    static async marcarComoLeido(chatId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats/${chatId}/leer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al marcar como leído:', error);
            throw error;
        }
    }

    /**
     * Elimina un chat
     * @param {number} chatId - ID del chat
     * @returns {Promise<void>}
     */
    static async eliminarChat(chatId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#obtenerToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al eliminar chat:', error);
            throw error;
        }
    }

    /**
     * Busca chats por texto
     * @param {string} busqueda - Texto a buscar
     * @returns {Promise<Array>} Chats filtrados
     */
    static async buscarChats(busqueda) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/chats/buscar?q=${encodeURIComponent(busqueda)}`, {
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
            console.error('Error al buscar chats:', error);
            throw error;
        }
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
     * Configura WebSocket para mensajes en tiempo real
     * @param {Function} onMensajeRecibido - Callback cuando se recibe un mensaje
     * @returns {WebSocket} Instancia del WebSocket
     */
    static configurarWebSocket(onMensajeRecibido) {
        const ws = new WebSocket(`ws://localhost:3000/ws?token=${this.#obtenerToken()}`);
        
        ws.onopen = () => {
            console.log('WebSocket conectado');
        };

        ws.onmessage = (event) => {
            const mensaje = JSON.parse(event.data);
            if (onMensajeRecibido) {
                onMensajeRecibido(mensaje);
            }
        };

        ws.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket desconectado');
            setTimeout(() => {
                this.configurarWebSocket(onMensajeRecibido);
            }, 3000);
        };

        return ws;
    }
}