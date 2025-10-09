const { Publicacion } = require('../models');

class SubastasDAO {

    constructor() { }

    async crearSubasta(/*Usar publicacionesDAO*/) {
        try {
            const publicacionCreada = await Producto.create({ titulo, descripcion, fechaPublicacion, precio, estado, idCategoria });
            ImagenesPublicacion.create()
            for (let i = 0; i < imagenes.length; i++) {
                ImagenesPublicacion.create({ url: imagenes[i], idPublicacion: publicacionCreada.id });
            }
            for (let i = 0; i < etiquetas.length; i++) {
                EtiquetasPublicacion.create({ etiqueta: etiquetas[i], idPublicacion: publicacionCreada.id });
            }
            return publicacionCreada;
        } catch (error) {
            throw error;
        }
    }

    // async obtenerSubastas() {}

    // async obtenerSubastaPorId(idSubasta) {}

    // async actualizarSubasta(/*AGREGAR PARÁMETROS*/) {}

    // async eliminarResenia(idSubasta) {}
}

module.exports = new SubastasDAO();