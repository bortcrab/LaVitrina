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

        const{foto, ...restoDatos} = datosUsuario;

        let fotoURL = '';
        try {

            if(foto && foto instanceof File){
                fotoURL = await UsuariosService.subirImagen(foto);
            }

            const payload = {
                ...restoDatos,
                fotoPerfil: fotoURL,
            };

            const response = await fetch(`${API_URL}/`,{
                method:'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload)
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error('Credenciales inválidas');
                
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static existeCorreo(correo) {
        const usuariosMock = [
            { correo: "abel@gmail.com" },
            { correo: "maria@gmail.com" }
        ];

        const existeEnMock = usuariosMock.some(u => u.correo === correo);
        const existeEnRegistrados = this.usuariosRegistrados.some(u => u.correo === correo);

        return existeEnMock || existeEnRegistrados;
    }

    static obtenerUsuariosRegistrados() {
        return this.usuariosRegistrados;
    }

    static obtenerUsuarioPorCorreo(correo) {
        return this.usuariosRegistrados.find(u => u.correo === correo);
    }
}