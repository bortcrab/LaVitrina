const { Subasta, Publicacion } = require('../models');
const publicacionesDAO = require('./publicacionesDAO');
const { Op } = require('sequelize');

class SubastasDAO {
    constructor() { }

    /**
     * Crea una nueva subasta junto con su publicación asociada.
     * 
     * @param {Object} datosSubasta - Datos de la subasta y de la publicación.
     * @returns {Promise<Object>} La subasta creada con los datos de la publicación.
     * @throws {Error} Si ocurre un error al crear la subasta.
     */
    async crearSubasta(datosSubasta) {
        try {
            const publicacionCreada = await publicacionesDAO.crearPublicacion(
                datosSubasta.titulo,
                datosSubasta.descripcion,
                datosSubasta.precio,
                datosSubasta.etiquetas,
                datosSubasta.imagenes,
                datosSubasta.idCategoria,
                datosSubasta.idUsuario
            );

            // Crea la subasta usando el id de la publicación creada
            const subastaCreada = await Subasta.create({
                id: publicacionCreada.id, // La subasta comparte el ID de la publicación
                fechaInicio: datosSubasta.fechaInicio,
                fechaFin: datosSubasta.fechaFin
            });

            // Retorna un objeto combinado
            return { ...publicacionCreada.get(), ...subastaCreada.get() };
        } catch (error) {
            throw error;
        }
    }

    async obtenerSubastas(filtros) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{ model: Publicacion }],
                where: {
                    ...(filtros.titulo && { '$Publicacion.titulo$': { [Op.like]: `%${filtros.titulo}%` } }),
                    ...(filtros.categoria && { '$Publicacion.idCategoria$': { [Op.eq]: filtros.categoria } }),
                    // Falta agregar filtros de etiquetas
                    ...(filtros.fechaInicio && { fechaInicio: { [Op.gte]: filtros.fechaInicio } }),
                    ...(filtros.fechaFin && { fechaFin: { [Op.lte]: filtros.fechaFin } })
                },
                limit: filtros.limite,
                offset: filtros.offset
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
     * @param {number} offset - Cantidad de registros a omitir antes de comenzar a devolver resultados.
     * @returns {Promise<Subasta[]>} Lista de subastas encontradas.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastasPorUsuario(idUsuario, offset) {
        try {
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    where: { idUsuario }
                }],
                limit: 20,
                offset
            });
            return subastasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una subasta dado un ID.
     * 
     * @param {number} idSubastas - ID de la subasta a buscar.
     * @returns {Promise<Subasta>} Subasta encontrada.
     * @throws {Error} Si ocurre un error al obtener la subastas.
     */
    async obtenerSubastaPorId(idSubasta) {
        try {
            const subastaObtenida = await Subasta.findByPk(idSubasta, {
                include: [{ model: Publicacion }]
            });
            return subastaObtenida;
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
                include: [{ model: Publicacion }]
            });

            if (!subasta || !subasta.Publicacion) {
                throw new Error('La subasta o su publicación asociada no existen.');
            }

            await subasta.Publicacion.update(datosActualizados);
            return subasta.Publicacion;
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
            const subasta = await this.obtenerSubastaPorId(idSubasta);

            if (!subasta || !subasta.Publicacion) {
                throw new Error('La subasta no existe.');
            }

            await subasta.destroy();
            await publicacionesDAO.eliminarPublicacion(idSubasta);

            return 'Subasta eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SubastasDAO();
