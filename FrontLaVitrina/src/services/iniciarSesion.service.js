
export class IniciarSesionService {

    static usuariosMock = [
        {
            idUsuario: 1,
            nombres: "Abel Eduardo",
            apellidoPaterno: "Sánchez",
            apellidoMaterno: "Guerrero",
            nombreCompleto: "Abel Eduardo Sánchez Guerrero",
            correo: "abel@gmail.com",
            contrasenia: "Abel123",
            telefono: "5551234567",
            ciudad: "CDMX",
            fechaNacimiento: "2000-08-15",
            edad: 24,
            fotoPerfil: null,
            puntuacion: 10
        },
        {
            idUsuario: 2,
            nombres: "María",
            apellidoPaterno: "González",
            apellidoMaterno: "López",
            nombreCompleto: "María González López",
            correo: "maria@gmail.com",
            contrasenia: "Maria123",
            telefono: "5559876543",
            ciudad: "Guadalajara",
            fechaNacimiento: "1995-03-20",
            edad: 29,
            fotoPerfil: null,
            puntuacion: 8
        }
    ];

    static usuarioActivo = null;

    static iniciarSesion(correo, contrasenia) {
        const usuariosRegistrados = this.obtenerUsuariosRegistrados();

        const todosUsuarios = [...this.usuariosMock, ...usuariosRegistrados];

        const usuarioEncontrado = todosUsuarios.find(u =>
            u.correo === correo && u.contrasenia === contrasenia
        );

        if (usuarioEncontrado) {
            this.usuarioActivo = usuarioEncontrado;
        }

        return usuarioEncontrado || null;

    }

    static obtenerUsuariosRegistrados() {
        //Aquí se consultaría bd
        return [];
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