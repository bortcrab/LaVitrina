import { IniciarSesionService } from './iniciarSesion.service.js';
import { Usuario } from '../models/usuario.js'; 

export class RegistrarService {

    static obtenerUsuariosLocales() {
        const usuariosGuardados = localStorage.getItem('usuariosRegistrados');
        if (usuariosGuardados) {
            const listaSimple = JSON.parse(usuariosGuardados);
            return listaSimple; 
        }
        return [];
    }

    static guardarUsuariosLocales(usuarios) {
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    }


    static registrarUsuario(datos) {
        const mocks = IniciarSesionService.usuariosMock;
        const locales = this.obtenerUsuariosLocales();
        const todos = [...mocks, ...locales];

        // 2. Validar correo único
        const existe = todos.some(u => u.correo === datos.correo);
        if (existe) {
            return { exito: false, mensaje: 'El correo electrónico ya está registrado.' };
        }

        // 3. Generar ID único
        const maxId = todos.length > 0 ? Math.max(...todos.map(u => u.idUsuario)) : 0;
        const nuevoId = maxId + 1;

        // 4. Instanciar tu clase Usuario
        // Nota: Pasamos los datos en el orden exacto de tu constructor
        const nuevoUsuario = new Usuario(
            nuevoId,                    // idUsuario
            datos.nombres,              // nombres
            datos.apellidoPaterno,      // apellidoPaterno
            datos.apellidoMaterno,      // apellidoMaterno
            datos.correo,               // correo
            datos.contrasenia,          // contrasenia
            datos.telefono,             // telefono
            datos.ciudad,               // ciudad
            datos.fechaNacimiento,      // fechaNacimiento
            datos.fotoPerfil || null    // fotoPerfil (opcional)
        );

        // 5. Guardar
        locales.push(nuevoUsuario);
        this.guardarUsuariosLocales(locales);

        return { exito: true, usuario: nuevoUsuario };
    }
}