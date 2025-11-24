export class Publicacion {
    constructor(
        id = 0,
        titulo = '', 
        descripcion = '', 
        precio = 0.0, 
        imagenes = null, 
        etiquetas = null, 
        estado = '', 
        usuario = null, 
        fechaPublicacion = null) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenes = imagenes;
        this.etiquetas = etiquetas;
        this.estado = estado;
        this.usuario = usuario;
        this.fechaPublicacion = fechaPublicacion;
    }
}