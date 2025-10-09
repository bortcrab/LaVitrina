const { Publicacion } = require('../models');
const { ImagenesPublicacion } = require('../models')
const { EtiquetasPublicacion } = require('../models')

class PublicacionesDAO {

    constructor() { }

    async crearPublicacion(titulo, descripcion, fechaPublicacion, precio, estado, idCategoria, etiquetas, imagenes) {
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

    async obtenerPublicacionPorId(idPublicacion) {
        try {
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);
            return publicacionEncontrada;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPublicaciones() {
        try {
            const publicionesObtenidas = await Publicacion.findAll();
            return publicionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /*
    async ectualizarPublicacion(idPublicacion, publicacionData) {

    }
    */

    async eliminarPublicacion(idPublicacion) {
        try {
            const publicacionObtenida = await this.obtenerPublicacionPorId(idPublicacion);

            if (!publicacionObtenida) {
                throw new Error('La publicacion no existe.');
            }

            publicacionObtenida.destroy();

            return 'Publicacion eliminada con exito.';
        } catch (error) {
            throw error;
        }
    }
}