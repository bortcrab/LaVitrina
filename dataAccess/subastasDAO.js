// Importa el modelo de Subasta (con su relación hacia Publicacion)
const { Subasta, Publicacion, EtiquetasPublicacion, ImagenesPublicacion } = require('../models');
// Operadores de Sequelize para consultas avanzadas
const { Op } = require('sequelize');
// Importa el DAO de publicaciones para reutilizar su creación
const publicacionesDAO = require('./publicacionesDAO');

/**
 * Clase para gestionar operaciones relacionadas con subastas, incluyendo creación,
 * obtención, actualización y eliminación de subastas junto con su publicación asociada.
 */
class SubastasDAO {

    /**
     * Crea una nueva subasta en la base de datos, junto con su publicación base, imágenes y etiquetas.
     * 
     * @param {Object} datosSubasta - Objeto con la información de la subasta y la publicación base.
     * @param {string} datosSubasta.titulo - Título de la publicación.
     * @param {string} datosSubasta.descripcion - Descripción de la publicación.
     * @param {Date} datosSubasta.fechaPublicacion - Fecha de publicación.
     * @param {number} datosSubasta.precio - Precio inicial de la subasta.
     * @param {string} datosSubasta.estado - Estado de la publicación.
     * @param {string[]} datosSubasta.etiquetas - Lista de etiquetas asociadas.
     * @param {string[]} datosSubasta.imagenes - Lista de URLs de imágenes asociadas.
     * @param {number} datosSubasta.idCategoria - ID de la categoría.
     * @param {number} datosSubasta.idUsuario - ID del usuario que crea la subasta.
     * @param {Date} datosSubasta.fechaInicio - Fecha de inicio de la subasta.
     * @param {Date} datosSubasta.fechaFin - Fecha de finalización de la subasta.
     * @returns {Promise<Object>} La subasta creada junto con su publicación.
     * @throws {Error} Si ocurre un error al crear la subasta.
     */
    async crearSubasta(datosSubasta) {
        try {
            // Primero crea la publicación base
            const publicacionCreada = await publicacionesDAO.crearPublicacion(
                datosSubasta.titulo,
                datosSubasta.descripcion,
                datosSubasta.fechaPublicacion,
                datosSubasta.precio,
                datosSubasta.estado,
                datosSubasta.etiquetas,
                datosSubasta.imagenes,
                datosSubasta.idCategoria,
                datosSubasta.idUsuario
            );

            // Luego crea la subasta asociada usando el mismo ID
            const subastaCreada = await Subasta.create({
                id: publicacionCreada.id,
                fechaInicio: datosSubasta.fechaInicio,
                fechaFin: datosSubasta.fechaFin
            });

            return { ...publicacionCreada.get(), ...subastaCreada.get() };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de subastas junto con su publicación asociada.
     * 
     * @returns {Promise<Subasta[]>} Lista de subastas obtenidas con su publicación.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastas() {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    include: ['Categoria', 'Usuario', 'ImagenesPublicacion', 'EtiquetasPublicacion']
                }],
                limit: 20
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las subastas asociadas a un usuario específico.
     * 
     * @param {number} idUsuario - ID del usuario cuyas subastas se desean obtener.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorUsuario(idUsuario) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    where: { idUsuario },
                    include: ['Categoria', 'ImagenesPublicacion']
                }]
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de subastas cuyo título de la publicación coincide parcialmente con el texto proporcionado.
     * 
     * @param {string} titulo - Texto a buscar en los títulos de las publicaciones asociadas.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorTitulo(titulo) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    where: {
                        titulo: { [Op.like]: `%${titulo}%` }
                    }
                }],
                limit: 20
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de subastas filtradas por categoría.
     * 
     * @param {number} idCategoria - ID de la categoría por la que se filtran las subastas.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorCategoria(idCategoria) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    where: { idCategoria }
                }],
                limit: 20
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de subastas que contienen alguna de las etiquetas especificadas.
     * 
     * @param {string[]} etiquetas - Lista de etiquetas por las que se filtran las subastas.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorEtiquetas(etiquetas) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    include: [{
                        model: EtiquetasPublicacion,
                        where: { etiqueta: { [Op.in]: etiquetas } }
                    }]
                }],
                limit: 20
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de subastas cuya fecha de publicación está dentro de un periodo específico.
     * 
     * @param {Date} fechaInicio - Fecha de inicio del periodo.
     * @param {Date} fechaFin - Fecha de fin del periodo.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorPeriodo(fechaInicio, fechaFin) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    as: 'publicacion',
                    where: {
                        fechaPublicacion: { [Op.between]: [fechaInicio, fechaFin] }
                    }
                }],
                limit: 20
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza los datos de la publicación asociada a una subasta existente.
     * 
     * @param {number} idSubasta - ID de la subasta a actualizar.
     * @param {Object} datosActualizados - Datos de la publicación a actualizar.
     * @returns {Promise<Publicacion>} La publicación actualizada.
     * @throws {Error} Si ocurre un error al actualizar la subasta.
     */
    async actualizarSubasta(idSubasta, datosActualizados) {
        try {
            const subasta = await Subasta.findByPk(idSubasta, {
                include: [{ model: Publicacion, as: 'publicacion' }]
            });

            if (!subasta || !subasta.publicacion) {
                throw new Error('La subasta o su publicación asociada no existen.');
            }

            await subasta.publicacion.update(datosActualizados);
            return subasta.publicacion;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina una subasta y su publicación asociada.
     * 
     * @param {number} idSubasta - ID de la subasta a eliminar.
     * @returns {Promise<string>} Mensaje de éxito si la subasta fue eliminada.
     * @throws {Error} Si ocurre un error al eliminar la subasta.
     */
    async eliminarSubasta(idSubasta) {
        try {
            const subasta = await Subasta.findByPk(idSubasta, {
                include: [{ model: Publicacion, as: 'publicacion' }]
            });

            if (!subasta || !subasta.publicacion) {
                throw new Error('La subasta no existe.');
            }

            // Elimina etiquetas e imágenes asociadas
            await EtiquetasPublicacion.destroy({ where: { idPublicacion: idSubasta } });
            await ImagenesPublicacion.destroy({ where: { idPublicacion: idSubasta } });

            // Elimina publicación y subasta
            await subasta.publicacion.destroy();
            await subasta.destroy();

            return 'Subasta eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new SubastasDAO();
