export class Publicacion {
    /**
     * @param {Object} datos - El objeto JSON que viene del backend
     */
    constructor(datos) {
        this.id = datos.id;
        this.titulo = datos.titulo;
        this.descripcion = datos.descripcion;
        
        // Convertimos precio a número para evitar errores matemáticos
        this.precio = Number(datos.precio) || 0; 
        
        this.imagenes = datos.imagenes || [];
        this.etiquetas = datos.etiquetas || [];
        
        this.estado = datos.estado || 'Disponible';
        this.tipo = datos.tipo || 'Venta';
        
        this.categoria = datos.categoria || { nombre: 'Sin categoría' };
        
        this.usuario = datos.usuario || null;
        
        this.fechaPublicacion = datos.fechaPublicacion || new Date().toLocaleDateString();

        this.vendido = this.estado === 'Vendido';
    }

    marcarComoVendido() {
        this.vendido = true;
        this.estado = 'Vendido';
    }

    marcarComoDisponible() {
        this.vendido = false;
        this.estado = 'Disponible';
    }

    cambiarEstadoVenta() {
        this.vendido = !this.vendido;
        this.estado = this.vendido ? 'Vendido' : 'Disponible';
    }
    

}