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
            datosPuja
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
     * Obtiene todas las pujas registradas de una subasta específica.
     * @param {number} idSubasta - ID de la subasta.
     * @param {number} offset - Cantidad de registros a omitir antes de comenzar a devolver resultados.
     * @returns {Promise<Array>} - Lista de pujas.
     */
    async obtenerPujas(idSubasta, offset) {
        try {
            const pujasObtenidas = await Puja.findAll({
                where: { idSubasta },
                offset,
                limit: 50,
                order: [['fechaPuja', 'DESC']]
            });
            return pujasObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las pujas realizadas por un usuario.
     * @param {number} offset - Cantidad de registros a omitir antes de comenzar a devolver resultados.
     * @param {number} idUsuario - ID del usuario que hizo las pujas.
     * @returns {Promise<Array>} - Lista de pujas del usuario.
     */
    async obtenerPujasPorUsuario(idUsuario, offset) {
        try {
            const pujasObtenidas = await Puja.findAll({
                where: { idUsuario },
                offset,
                limit: 50,
                order: [['fechaPuja', 'DESC']]
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
            console.log(idSubasta);
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