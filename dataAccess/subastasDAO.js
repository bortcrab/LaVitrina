const { Subasta, Publicacion } = require('../models');
const { Op } = require('sequelize');
const { obtenerUsuarioPorId } = require('./usuariosDAO');

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
            const publicacionCreada = await Publicacion.create({
                titulo: datosSubasta.titulo,
                descripcion: datosSubasta.descripcion,
                fechaPublicacion: datosSubasta.fechaPublicacion,
                precio: datosSubasta.precio,
                estado: datosSubasta.estado,
                idCategoria: datosSubasta.idCategoria,
                idUsuario: datosSubasta.idUsuario
            });

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
                include: [{ model: Publicacion }],
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
                    where: { idUsuario }
                }]
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
                    where: { titulo: { [Op.like]: `%${titulo}%` } }
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
                    where: { fechaPublicacion: { [Op.between]: [fechaInicio, fechaFin] } }
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
            await subasta.Publicacion.destroy();

            return 'Subasta eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SubastasDAO();
