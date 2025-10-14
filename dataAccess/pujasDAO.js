const { Puja } = require('../models');

class PujasDAO {
    constructor() { }

    /**
     * Crea una nueva puja en la base de datos.
     * @param {Object} datosPuja - Objeto con los datos de la puja a crear.
     * @returns {Promise<Object>} - La puja creada.
     */
    async crearPuja(datosPuja) {
        try {
            // Usamos todos los datos del objeto
            const pujaCreada = await Puja.create({
                ...datosPuja
            });
            return pujaCreada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las pujas registradas.
     * @returns {Promise<Array>} - Lista de pujas.
     */
    async obtenerPujas() {
        try {
            const pujasObtenidas = await Puja.findAll();
            return pujasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una puja por su ID.
     * @param {number} idPuja - ID de la puja.
     * @returns {Promise<Object|null>} - La puja encontrada o null si no existe.
     */
    async obtenerPujaPorId(idPuja) {
        try {
            const pujaObtenida = await Puja.findByPk(idPuja);
            return pujaObtenida;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las pujas realizadas por un usuario.
     * @param {number} idUsuario - ID del usuario que hizo las pujas.
     * @returns {Promise<Array>} - Lista de pujas del usuario.
     */
    async obtenerPujasPorUsuario(idUsuario) {
        try {
            const pujasObtenidas = await Puja.findAll({
                where: { idUsuario }
            });
            return pujasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene la puja más alta de una subasta específica.
     * @param {number} idSubasta - ID de la subasta.
     * @returns {Promise<Object|null>} - La puja más alta o null si no hay pujas.
     */
    async obtenerPujaMasAlta(idSubasta) {
        try {
            const pujaMasAlta = await Puja.findOne({
                where: { idSubasta },
                order: [['monto', 'DESC']]
            });
            return pujaMasAlta;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PujasDAO();