const { Resenia } = require('../models');

class ReseniasDAO {
    constructor() { }

    get _configuracionConsulta(){
        return{
            attributes: { exclude: ['createdAt', 'updatedAt', 'idUsuarioCreador', 'idUsuarioReseniado'] },
            include: [
                {
                    model: Usuario,
                    as: 'usuarioReseniado', 
                    attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'fotoPerfil']
                },
                {
                    model: Usuario,
                    as: 'usuarioCreador',   
                    attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'fotoPerfil']
                }
            ]
        }
    }
    /**
     * Crea una nueva reseña en la base de datos.
     * @param {Object} datosResenia - Objeto con los datos de la reseña a crear.
     * @returns {Promise<Object>} - La reseña creada.
     */
    async crearResenia(datosResenia) {
        try {
            // Usamos todos los datos del objeto
            const resenia = await Resenia.create({
                ...datosResenia
            });
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las reseñas registradas en la base de datos.
     * @returns {Promise<Array>} - Lista de reseñas.
     */
    async obtenerResenias() {
        try {
            const resenias = await Resenia.findAll();
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una reseña por su ID.
     * @param {number} idResenia - ID de la reseña.
     * @returns {Promise<Object|null>} - La reseña encontrada o null si no existe.
     */
    async obtenerReseniaPorId(idResenia) {
        try {
            const resenia = await Resenia.findByPk(idResenia);
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las reseñas dirigidas a un usuario (usuario reseñado).
     * @param {number} idUsuarioReseniado - ID del usuario reseñado.
     * @returns {Promise<Array>} - Lista de reseñas del usuario reseñado.
     */
    async obtenerReseniasPorUsuarioReseniado(idUsuarioReseniado) {
        try {
            const resenias = await Resenia.findAll({
                where: { idUsuarioReseniado }
            });
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene las reseñas con mayor calificación de un usuario reseñado.
     * @param {number} idUsuarioReseniado - ID del usuario reseñado.
     * @returns {Promise<Array>} - Lista de reseñas con calificación más alta.
     */
    async obtenerReseniasMasAltas(idUsuarioReseniado) {
        try {
            const resenias = await Resenia.findAll({
                where: { idUsuarioReseniado },
                order: [['calificacion', 'DESC']]
            });
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene las reseñas con menor calificación de un usuario reseñado.
     * @param {number} idUsuarioReseniado - ID del usuario reseñado.
     * @returns {Promise<Array>} - Lista de reseñas con calificación más baja.
     */
    async obtenerReseniasMasBajas(idUsuarioReseniado) {
        try {
            const resenias = await Resenia.findAll({
                where: { idUsuarioReseniado },
                order: [['calificacion', 'ASC']]
            });
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las reseñas creadas por un usuario específico.
     * @param {number} idUsuarioCreador - ID del usuario que escribió las reseñas.
     * @returns {Promise<Array>} - Lista de reseñas creadas por el usuario.
     */
    async obtenerReseniasPorUsuarioCreador(idUsuarioCreador) {
        try {
            const resenias = await Resenia.findAll({
                where: { idUsuarioCreador }
            });
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza una reseña existente.
     * @param {number} idResenia - ID de la reseña a actualizar.
     * @param {Object} datosResenia - Datos nuevos para la reseña.
     * @returns {Promise<Object>} - La reseña actualizada.
     */
    async actualizarResenia(idResenia, datosResenia) {
        try {
            await Resenia.update(datosResenia, { where: { id: idResenia } });
            const reseniaActualizada = await Resenia.findByPk(idResenia);
            return reseniaActualizada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina una reseña por su ID.
     * @param {number} idResenia - ID de la reseña a eliminar.
     * @returns {Promise<string>} - Mensaje de confirmación de eliminación.
     */
    async eliminarResenia(idResenia) {
        try {
            const resenia = await Resenia.findByPk(idResenia);
            if (!resenia) {
                throw new Error(`Resenia con id: ${idResenia} no encontrada`);
            }
            await resenia.destroy();
            return 'Resenia eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }

    async calcularPuntuacionUsuario(idUsuario) {
        try {
            const resenias = Resenia.findAll({
                where: {
                    idUsuarioReseniado: idUsuario
                }
            });

            let sumPuntuaciones;
            for(const resenia of resenias) {
                sumPuntuaciones += resenia.calificacion; 
            }

            return sumPuntuaciones / resenias.length;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new ReseniasDAO();
