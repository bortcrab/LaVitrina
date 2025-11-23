export class Publicacion {
    constructor(id, titulo, descripcion, precio, imagen, etiquetas, estado, usuario) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.etiquetas = etiquetas; 
        this.estado = estado; 
        this.usuario = usuario;
        this.fechaPublicacion = new Date();
    }
}