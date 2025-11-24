export class Chat {
    constructor(id, nombre, fechaCreacion, idPublicacion, usuarios = [], mensajes = [], publicacion = null) {
        this.id = id;
        this.nombre = nombre;
        this.fechaCreacion = new Date(fechaCreacion);
        this.idPublicacion = idPublicacion;
        this.usuarios = usuarios;
        this.mensajes = mensajes;
        this.publicacion = publicacion;
        
        this.ultimoMensajeData = this.mensajes.length > 0 ? this.mensajes[0] : null;
    }

    getNombreMostrar(miIdUsuario) {
        const otroUsuario = this.usuarios.find(u => u.id !== miIdUsuario);
        if (otroUsuario) {
            const partesNombre = this.nombre.split(' - ');
            const nombreProducto = partesNombre.length > 2 ? partesNombre[2] : "Producto";
            return `${otroUsuario.nombres} - ${nombreProducto}`;
        }
        return this.nombre;
    }

    getServicioMostrar() {
        if (this.publicacion && this.publicacion.titulo) {
            return this.publicacion.titulo;
        }
        const partes = this.nombre.split(' - ');
        return partes[2] || "Artículo";
    }

    getAvatar(miIdUsuario) {
        const otroUsuario = this.usuarios.find(u => u.id !== miIdUsuario);
        return otroUsuario ? otroUsuario.fotoPerfil : 'https://i.pravatar.cc/150?img=default';
    }

    getProductoImg() {
        if (this.publicacion && this.publicacion.ImagenesPublicacions && this.publicacion.ImagenesPublicacions.length > 0) {
            return this.publicacion.ImagenesPublicacions[0].url;
        }
        return "https://via.placeholder.com/150?text=Sin+Foto";
    }

    getUltimoMensajeTexto() {
        if (!this.ultimoMensajeData) return "Inicia la conversación...";
        
        if (this.ultimoMensajeData.MensajeTexto) {
            return this.ultimoMensajeData.MensajeTexto.texto;
        } 
        else if (this.ultimoMensajeData.MensajeImagen) {
            return "📷 Foto";
        }
        return "...";
    }

    esUltimoMensajeMio(miIdUsuario) {
        return this.ultimoMensajeData && this.ultimoMensajeData.idUsuario === miIdUsuario;
    }
}