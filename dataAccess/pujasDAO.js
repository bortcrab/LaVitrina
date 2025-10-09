const { Puja } = require('../models');

class PujaDAO {
    constructor() { }

    async crearPuja(monto, fechaPuja, idUsuario, idSubasta) {
        try {
            const puja = await Puja.create({
                monto,
                fechaPuja,
                idUsuario,
                idSubasta
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

    async actualizarPuja(idPuja, monto, fechaPuja, idUsuario, idSubasta) {
        try {
            await Puja.update(
                { monto, fechaPuja, idUsuario, idSubasta },
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