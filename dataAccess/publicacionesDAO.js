// Importa el modelo de publicaciones
const { Publicacion } = require('../models');
// Importa el modelo de imágenes asociadas a publicaciones
const { ImagenesPublicacion } = require('../models')
// Importa el modelo de etiquetas asociadas a publicaciones
const { EtiquetasPublicacion } = require('../models')

/**
 * Clase para gestionar operaciones relacionadas con publicaciones, incluyendo creación,
 * obtención, actualización y eliminación de publicaciones.
 */
class PublicacionesDAO {

    /**
     * Constructor de la clase PublicacionesDAO.
     * Inicializa la instancia para gestionar operaciones de publicaciones.
     */
    constructor() { }

    /**
     * Crea una nueva publicación en la base de datos, junto con sus imágenes y etiquetas asociadas.
     * 
     * @param {string} titulo - Título de la publicación.
     * @param {string} descripcion - Descripción de la publicación.
     * @param {Date} fechaPublicacion - Fecha de publicación.
     * @param {number} precio - Precio de la publicación.
     * @param {string} estado - Estado de la publicación.
     * @param {string[]} etiquetas - Lista de etiquetas asociadas.
     * @param {string[]} imagenes - Lista de URLs de imágenes asociadas.
     * @param {number} idCategoria - ID de la categoría asociada.
     * @param {number} idUsuario - ID del usuario que crea la publicación.
     * @returns {Promise<Publicacion>} La publicación creada.
     * @throws {Error} Si ocurre un error al crear la publicación.
     */
    async crearPublicacion(titulo, descripcion, fechaPublicacion, precio, estado, etiquetas, imagenes, idCategoria, idUsuario) {
        try {
            const publicacionCreada = await Producto.create({ titulo, descripcion, fechaPublicacion, precio, estado, idCategoria, idUsuario });
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

    /**
     * Obtiene una lista de publicaciones, limitado a 20 resultados.
     * 
     * @returns {Promise<Publicacion[]>} Lista de publicaciones obtenidas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicaciones() {
        try {
            const publicionesObtenidas = await Publicacion.findAll({ limit: 20 });
            return publicionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las publicaciones asociadas a un usuario específico.
     * 
     * @param {number} idUsuario - ID del usuario cuyas publicaciones se desean obtener.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionPorUsuario(idUsuario) {
        try {
            const publicacionObtenida = await Publicacion.findAll({
                where: {
                    idUsuario: idUsuario
                }
            });
            return publicacionEncontrada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones cuyo título coincide parcialmente con el texto proporcionado.
     * 
     * @param {string} titulo - Texto a buscar en los títulos de las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorTitulo(titulo) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    titulo: {
                        [Op.like]: `%${titulo}%`
                    }
                }, limit: 20
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones filtradas por categoría, limitado a 20 resultados.
     * 
     * @param {number} idCategoria - ID de la categoría por la que se filtran las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorCategoria(idCategoria) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    idCategoria: idCategoria
                }, limit: 20
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }
    /**
     * Obtiene una lista de publicaciones que contienen alguna de las etiquetas especificadas.
     * 
     * @param {string[]} etiquetas - Lista de etiquetas por las que se filtran las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorEtiquetas(etiquetas) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                include: [{
                    model: EtiquetasPublicacion, where: {
                        etiqueta: {
                            [Op.in]: etiquetas
                        }
                    }
                }], limit: 20
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones dentro de un periodo de fechas específico.
     * 
     * @param {Date} fechaInicio - Fecha de inicio del periodo.
     * @param {Date} fechaFin - Fecha de fin del periodo.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas en el periodo.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorPerido(fechaInicio, fechaFin) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    fechaPublicacion: {
                        [Op.between]: [fechaInicio, fechaFin]
                    }
                }, limit: 20
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza los datos de una publicación existente.
     * 
     * @param {number} idPublicacion - ID de la publicación a actualizar.
     * @param {string} titulo - Nuevo título de la publicación.
     * @param {string} descripcion - Nueva descripción de la publicación.
     * @param {number} precio - Nuevo precio de la publicación.
     * @param {string} estado - Nuevo estado de la publicación.
     * @param {number} idCategoria - Nueva categoría de la publicación.
     * @param {string[]} etiquetas - Nuevas etiquetas asociadas.
     * @param {string[]} imagenes - Nuevas URLs de imágenes asociadas.
     * @returns {Promise<Publicacion>} La publicación actualizada.
     * @throws {Error} Si ocurre un error al actualizar la publicación.
     */
    async actualizarPublicacion(idPublicacion, titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes) {
        try {
            const publicacion = await thisobtenerPublicacionPorId(idPublicacion);

            if (!publicacion) {
                throw new Error('La publicacion no existe.');
            }

            const publicacionActualizada = await publicacion.update({ titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes }, { new: true });
            return publicacionActualizada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina una publicación existente por su ID.
     * 
     * @param {number} idPublicacion - ID de la publicación a eliminar.
     * @returns {Promise<string>} Mensaje de éxito si la publicación fue eliminada.
     * @throws {Error} Si ocurre un error al eliminar la publicación o no existe.
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

module.exports = new PublicacionesDAO();