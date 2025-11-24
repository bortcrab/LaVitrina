import { Usuario } from '../models/usuario.js';

export class PerfilService {
    
    static usuarioDataDB = {
        id: 1,
        nombres: "Pedro",
        apellidoPaterno: "Sola",
        apellidoMaterno: "Sola",
        correo: "pedro.sola@correo.com",
        contrasenia: "********",
        telefono: "7776687989",
        ciudad: "CDMX",
        fechaNacimiento: "1960-10-04",
        fotoPerfil: "https://i.pravatar.cc/150?img=12"
    };

    static async obtenerPerfil() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const usuario = new Usuario(
                    this.usuarioDataDB.id,
                    this.usuarioDataDB.nombres,
                    this.usuarioDataDB.apellidoPaterno,
                    this.usuarioDataDB.apellidoMaterno,
                    this.usuarioDataDB.correo,
                    this.usuarioDataDB.contrasenia,
                    this.usuarioDataDB.telefono,
                    this.usuarioDataDB.ciudad,
                    this.usuarioDataDB.fechaNacimiento,
                    this.usuarioDataDB.fotoPerfil
                );

                usuario.fechaCreacion = "02/11/2025";
                usuario.rating = 4.9;
                usuario.totalReseñas = 108;
                usuario.avatar = usuario.fotoPerfil; 

                resolve(usuario);
            }, 100);
        });
    }

    static async actualizarPerfil(datosActualizados) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.usuarioDataDB = { ...this.usuarioDataDB, ...datosActualizados };
                this.obtenerPerfil().then(usuario => resolve(usuario));
            }, 100);
        });
    }
}