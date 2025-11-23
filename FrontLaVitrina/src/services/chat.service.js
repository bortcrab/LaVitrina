export class ChatService {
    static API_BASE_URL = 'http://localhost:3000/api';
    
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

    static #obtenerToken() {
        return localStorage.getItem('authToken');
    }

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