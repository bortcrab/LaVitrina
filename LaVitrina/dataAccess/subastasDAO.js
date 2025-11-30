const { Subasta, Publicacion, EtiquetasPublicacion } = require('../models');
const publicacionesDAO = require('./publicacionesDAO');
const etiquetasDAO = require('./etiquetasDAO');
const imagenesDAO = require('./imagenesDAO');
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
            const publicacionCreada = await publicacionesDAO.crearPublicacion(datosSubasta);

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

    /**
     * Obtiene una lista de subastas.
     * 
     * @param {Object} filtros - Filtros para la búsqueda de subastas.
     * @returns {Promise<Object>} Las subastas obtenidas con los datos de sus publicaciones.
     * @throws {Error} Si ocurre un error al obtener las subastas.
     */
    async obtenerSubastas(filtros) {
        try {
            console.log(filtros);
            const subastasObtenidas = await Subasta.findAll({
                include: [{
                    model: Publicacion,
                    include: filtros.etiquetas && filtros.etiquetas.length > 0 ? [{
                        model: EtiquetasPublicacion,
                        where: {
                            etiqueta: {
                                [Op.in]: filtros.etiquetas // Coincide con alguna de las etiquetas enviadas
                            }
                        }
                    }] : []
                }],
                where: {
                    ...(filtros.titulo && { '$Publicacion.titulo$': { [Op.like]: `%${filtros.titulo}%` } }),
                    ...(filtros.categoria && { '$Publicacion.idCategoria$': { [Op.eq]: filtros.categoria } }),
                    ...(filtros.fechaInicio && { fechaInicio: { [Op.gte]: filtros.fechaInicio } }),
                    ...(filtros.fechaFin && { fechaFin: { [Op.lte]: filtros.fechaFin } })
                },
                limit: 20, // 20 subastas por página
                offset: filtros.offset
            });
            return subastasObtenidas;
        } catch (error) {
            console.log(error);
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
                include: [{
                    model: Publicacion,
                    include: [{
                        model: EtiquetasPublicacion,
                        attributes: ['etiqueta']
                    }]
                }]
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
            console.log("Actualizando subasta ID:", idSubasta);

            // 1. Buscar la subasta con su publicación
            let subasta = await Subasta.findByPk(idSubasta, {
                include: [{ model: Publicacion }]
            });

            // 2. Si NO existe la subasta
            if (!subasta) {
                // Verificar si al menos existe la publicación
                const publicacion = await Publicacion.findByPk(idSubasta);

                if (!publicacion) {
                    throw new Error('La publicación no existe. No se puede crear la subasta.');
                }

                // Si existe la publicación, crear la subasta
                console.log("Publicación existe. Creando nueva subasta...");
                await Subasta.create({
                    id: idSubasta,
                    fechaInicio: datosActualizados.fechaInicio,
                    fechaFin: datosActualizados.fechaFin
                });

                // Recargar la subasta recién creada con su publicación
                subasta = await Subasta.findByPk(idSubasta, {
                    include: [{ model: Publicacion }]
                });
            }

            // 3. Actualizar etiquetas
            const etiquetas = datosActualizados.etiquetas || [];
            await etiquetasDAO.actualizarEtiquetas(idSubasta, etiquetas);

            // 4. Actualizar la publicación
            await subasta.Publicacion.update({
                titulo: datosActualizados.titulo,
                descripcion: datosActualizados.descripcion,
                precio: datosActualizados.precio,
                idCategoria: datosActualizados.idCategoria,
                imagenes: datosActualizados.imagenes
            });

            // 5. Actualizar la subasta (solo fechas)
            await subasta.update({
                fechaInicio: datosActualizados.fechaInicio,
                fechaFin: datosActualizados.fechaFin
            });

            // 7. Actualizar imagenes
            const imagenes = datosActualizados.imagenes || [];

            await imagenesDAO.actualizarImagenes(idSubasta, imagenes);


            // 6. Recargar y retornar la subasta actualizada
            await subasta.reload({ include: [{ model: Publicacion }] });
            return subasta.toJSON();

        } catch (error) {
            console.error("Error al actualizar subasta:", error);
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
