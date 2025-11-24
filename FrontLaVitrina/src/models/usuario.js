export class Usuario {
    constructor(
        idUsuario = 0,
        nombres = '',
        apellidoPaterno = '',
        apellidoMaterno = '',
        correo = '',
        contrasenia = '',
        telefono = '',
        ciudad = '',
        fechaNacimiento = null,
        fotoPerfil = null,
        puntuacion = 0
    ) {
        this.idUsuario = idUsuario;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.telefono = telefono;
        this.ciudad = ciudad;
        this.fechaNacimiento = fechaNacimiento;
        this.edad = this.calcularEdad(fechaNacimiento);
        this.fotoPerfil = fotoPerfil;
        this.puntuacion = puntuacion    ;
    }

    calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    }
}