// Importa el modelo de publicaciones
const { Publicacion } = require('../models');
// Importa el modelo de imágenes asociadas a publicaciones
const { ImagenesPublicacion } = require('../models')
// Importa el modelo de etiquetas asociadas a publicaciones
const { EtiquetasPublicacion } = require('../models')
// Importa operadores de consulta de Sequelize para búsquedas avanzadas
const { Op } = require('sequelize');

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
     * @param {number} precio - Precio de la publicación.
     * @param {string[]} etiquetas - Lista de etiquetas asociadas.
     * @param {string[]} imagenes - Lista de URLs de imágenes asociadas.
     * @param {number} idCategoria - ID de la categoría asociada.
     * @param {number} idUsuario - ID del usuario que crea la publicación.
     * @returns {Promise<Publicacion>} La publicación creada.
     * @throws {Error} Si ocurre un error al crear la publicación.
     */
    async crearPublicacion(titulo, descripcion, precio, etiquetas, imagenes, idCategoria, idUsuario) {
        try {
            const fechaPublicacion = new Date();
            const estado = 'Disponible';

            const publicacionCreada = await Publicacion.create({ titulo, descripcion, fechaPublicacion, precio, estado, idCategoria, idUsuario });
            for (let i = 0; i < imagenes.length; i++) {
                await ImagenesPublicacion.create({ url: imagenes[i], idPublicacion: publicacionCreada.id });
            }
            for (let i = 0; i < etiquetas.length; i++) {
                await EtiquetasPublicacion.create({ etiqueta: etiquetas[i], idPublicacion: publicacionCreada.id });
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
    async obtenerPublicaciones(offset) {
        try {
            const publicionesObtenidas = await Publicacion.findAll({
                limit: 20,
                offset
            });
            return publicionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una publicación por su ID.
     *
     * @param {number} idPublicacion - ID de la publicación a buscar.
     * @returns {Promise<Publicacion|null>} La publicación encontrada o null si no existe.
     * @throws {Error} Si ocurre un error durante la consulta a la base de datos.
     */
    async obtenerPublicacionPorId(idPublicacion) {
        try {
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);
            return publicacionObtenida;
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
    async obtenerPublicacionesPorUsuario(idUsuario, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    idUsuario: idUsuario,
                },
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
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
    async obtenerPublicacionesPorTitulo(titulo, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    titulo: {
                        [Op.like]: `%${titulo}%` //Se usa el operador like para los titulos que coincidan con el mandado en el parámetro
                    }
                },
                limit: 20,
                offset
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
    async obtenerPublicacionesPorCategoria(idCategoria, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    idCategoria: idCategoria
                },
                limit: 20,
                offset
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
    async obtenerPublicacionesPorEtiquetas(etiquetas, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                include: [{
                    model: EtiquetasPublicacion, where: {
                        etiqueta: {
                            [Op.in]: etiquetas //Se usa el operador in para las etiquetas que coincidan con las mandadas en el parámetro
                        }
                    }
                }],
                limit: 20,
                offset
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
    async obtenerPublicacionesPorPeriodo(fechaInicio, fechaFin, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    fechaPublicacion: {
                        [Op.between]: [fechaInicio, fechaFin] //Se usa el operador between para las fechas que están dentro del periodo
                    }
                },
                limit: 20,
                offset
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
            //Busca la publicación para actualizarla
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);

            //Si la publicación no existe, tira una excepción
            if (!publicacionObtenida) {
                throw new Error('La publicacion no existe.');
            }

            //Actualiza la publicación con los datos mandados en los parámetros
            const publicacionActualizada = await publicacionObtenida.update({ titulo, descripcion, precio, estado, idCategoria, etiquetas, imagenes }, { new: true });
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
            //Busca la publicación para eliminarla
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);

            //Si la publicación no existe, tira una excepción
            if (!publicacionObtenida) {
                throw new Error('La publicacion no existe.');
            }

            //Elimina las etiquetas asociadas a la publicación
            await EtiquetasPublicacion.destroy({
                where: {
                    idPublicacion: idPublicacion
                }
            });

            //Elimina las imágenes asociadas a la publicación
            await ImagenesPublicacion.destroy({
                where: {
                    idPublicacion: idPublicacion
                }
            });

            //Elimina la publicación
            await publicacionObtenida.destroy();
            return 'Publicacion eliminada con exito.';
        } catch (error) {
            throw error;
        }
    }

}

//Se exporta la clase PublicacionesDAO
module.exports = new PublicacionesDAO();