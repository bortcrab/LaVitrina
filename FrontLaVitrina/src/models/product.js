export class Product {
    constructor(id, titulo, descripcion, precio, imagen, tipo, vendedor) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.tipo = tipo; 
        this.vendedor = vendedor;
        this.fechaPublicacion = new Date();
    }
}
