export class Publicacion {
    constructor(id, titulo, descripcion, precio, imagen, etiquetas = [], estado = 'Venta', vendido = false, usuario = null) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.etiquetas = etiquetas;
        this.estado = estado;
        this.vendido = vendido;
        this.usuario = usuario;
        this.fechaPublicacion = new Date().toLocaleDateString('es-MX');
    }

    marcarComoVendido() {
        this.vendido = true;
    }

    marcarComoDisponible() {
        this.vendido = false;
    }

    cambiarEstadoVenta() {
        this.vendido = !this.vendido;
    }
}