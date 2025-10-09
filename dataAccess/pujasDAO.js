const { Puja } = require('../models');

class PujaDAO {
    constructor() { }

    async crearPuja(idUsuario, idSubasta, monto, fechaPuja) {
        try {
            const puja = await Puja.create({
                idUsuario,
                idSubasta,
                monto,
                fechaPuja
            });
            return puja;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPujas() {
        try {
            const pujas = await Pujas.findAll();
            return pujas;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPujaPorId(id) {
        try {
            const puja = await Puja.findByPk(id);
            return puja;
        } catch (error) {
            throw error;
        }
    }

    async actualizarPuja(idPuja, idUsuario, idSubasta, monto, fechaPuja) {
        try {
            await Puja.update(
                { idUsuario, idSubasta, monto, fechaPuja },
                { where: { idPuja } }
            );
            const pujaActualizada = await Puja.findByPk(id);
            return pujaActualizada;
        } catch (error) {
            throw error;
        }
    }

    async eliminarPuja(id) {
        try {
            const puja = await Puja.findByPk(id);
            if (!puja) {
                throw new Error(`Puja con id: ${id} no encontrada`);
            }
            await puja.destroy();
            return 'Puja eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PujaDAO();