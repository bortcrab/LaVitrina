export class Publicacion {
    constructor(id, titulo, descripcion, precio, imagen, etiquetas = [], estado = 'Venta', vendido = false, usuario = null, fecha = null) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.etiquetas = etiquetas;
        this.estado = estado;
        this.vendido = vendido;
        this.usuario = usuario;
        
        this.fechaPublicacion = fecha ? fecha : new Date();
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