export class PerfilService {
    
    static usuarioMock = {
        id: 1,
        nombres: "Pedro",
        apellidoPaterno: "Sola",
        apellidoMaterno: "Sola",
        correo: "pedro.sola@correo.com",
        celular: "7776687989",
        fechaNacimiento: "04/10/1960",
        fechaCreacion: "02/11/2025",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.9,
        totalReseñas: 108
    };

    static async obtenerPerfil() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...this.usuarioMock });
            }, 100);
        });
    }

    static async actualizarPerfil(datosActualizados) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.usuarioMock = { ...this.usuarioMock, ...datosActualizados };
                resolve({ ...this.usuarioMock });
            }, 100);
        });
    }
}