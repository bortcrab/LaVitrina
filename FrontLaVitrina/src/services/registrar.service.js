import { Usuario } from '../models/usuario.js';

export class RegistrarService {
    static usuariosRegistrados = [];

    static registrarUsuario(datos) {
        const { 
            nombres, 
            apellidoPaterno, 
            apellidoMaterno, 
            correo, 
            contrasenia, 
            telefono, 
            ciudad, 
            fechaNacimiento, 
            fotoPerfil 
        } = datos;

        if (this.existeCorreo(correo)) {
            return {
                exito: false,
                mensaje: 'Este correo ya está registrado'
            };
        }

        const nuevoId = this.usuariosRegistrados.length + 100;
        
        const nuevoUsuario = new Usuario(
            nuevoId,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            correo,
            contrasenia,
            telefono,
            ciudad,
            fechaNacimiento,
            fotoPerfil
        );

        this.usuariosRegistrados.push(nuevoUsuario);

        console.log('Usuario registrado:', nuevoUsuario);
        console.log('Total usuarios:', this.usuariosRegistrados.length);

        return {
            exito: true,
            usuario: nuevoUsuario
        };
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